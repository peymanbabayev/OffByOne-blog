import "server-only";

/**
 * Cloudflare Workers AI ilə post örtük şəkli generasiyası:
 * mətn → (LLM) ingiliscə illustrasiya təsviri → (FLUX) şəkil.
 * Modellər üçün Cloudflare sənədlərinə bax; `llama-3.1-8b-instruct` silindiyi üçün fp8 variantı seçilib.
 */

const LLM_MODEL = "@cf/meta/llama-3.1-8b-instruct-fp8";
const IMAGE_MODEL = "@cf/black-forest-labs/flux-1-schnell";

// Neuron qənaəti: LLM-ə yalnız mövzunu anlamaq üçün kifayət qədər mətn göndərilir.
const MAX_CONTENT_CHARS = 800;
const MAX_TITLE_CHARS = 200;
const MAX_IMAGE_PROMPT_CHARS = 600;
const LLM_MAX_TOKENS = 80;
// FLUX-1-schnell 4 addım üçün öyrədilib; azaltmaq keyfiyyəti gözəçarpan dərəcədə pisləşdirir.
const FLUX_STEPS = 4;
const REQUEST_TIMEOUT_MS = 45_000;

const IMAGE_STYLE_SUFFIX =
  "Isometric technical illustration, clean vector style, dark blue background with neon accents, soft lighting, no text, no letters, no numbers, no logos.";

// Model qaydaya həmişə əməl etmir — brend adları FLUX-a getməmişdən əvvəl kodla silinir,
// əks halda şəkildə yazı kimi çəkilir.
const BRAND_NAMES =
  /\b(?:docker(?:file)?|kubernetes|k8s|nginx|apache|vps|aws|azure|gcp|google|github(?:\s+actions)?|gitlab|git|vercel|netlify|cloudflare|heroku|neon|next\.?js|react|vue|angular|svelte|node\.?js|deno|bun|typescript|javascript|python|java|golang|rust|php|postgres(?:ql)?|mysql|mongodb|redis|sqlite|prisma|graphql|tailwind(?:css)?|linux|ubuntu|windows|macos|let'?s\s+encrypt|https?|api|sql|css|html|json|app\s+router)\b/gi;

export function stripBrandNames(description: string): string {
  return description
    .replace(BRAND_NAMES, "")
    .replace(/\s+([,.;:])/g, "$1")
    .replace(/,\s*,/g, ",")
    .replace(/\s{2,}/g, " ")
    .trim();
}

export const PROMPT_SYSTEM_MESSAGE = [
  "You write prompts for an AI image generator that makes cover images for a software engineering blog.",
  "Given a blog post title and excerpt (in any language), describe ONE cover illustration for it in English, in a single sentence of at most 40 words.",
  "The scene must be clearly technical and directly related to the topic: use concrete computing hardware and objects such as servers, server racks, shipping containers, circuit boards, chips, network cables, glowing data streams, database cylinders, gears, pipes or connected nodes. Do not use screens, monitors, laptops, charts, dashboards, landscapes, nature scenes or abstract metaphors.",
  "Do not include any text, letters, numbers, labels, logos, real people, celebrities, violence or nudity.",
  "Never mention brand, product, company, software, framework or technology names (for example Docker, React, AWS), nor labels, signs, acronyms or any words that could be painted as text; describe the equivalent generic technical objects instead.",
  "Describe only what is visible in the picture; do not explain what it symbolizes or represents.",
  "Reply with the description only, without quotes or preamble.",
].join(" ");

export type AiImageErrorCode = "not_configured" | "failed";

export class AiImageError extends Error {
  constructor(
    public readonly code: AiImageErrorCode,
    message: string,
  ) {
    super(message);
    this.name = "AiImageError";
  }
}

function getCredentials(): { accountId: string; apiToken: string } {
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID?.trim();
  const apiToken = process.env.CLOUDFLARE_API_TOKEN?.trim();
  if (!accountId || !apiToken) {
    throw new AiImageError("not_configured", "CLOUDFLARE_ACCOUNT_ID / CLOUDFLARE_API_TOKEN təyin edilməyib.");
  }
  return { accountId, apiToken };
}

export function isAiImageConfigured(): boolean {
  return Boolean(process.env.CLOUDFLARE_ACCOUNT_ID?.trim() && process.env.CLOUDFLARE_API_TOKEN?.trim());
}

interface CloudflareEnvelope<T> {
  success?: boolean;
  result?: T;
  errors?: { code?: number; message?: string }[];
}

async function runModel<T>(model: string, body: unknown): Promise<T> {
  const { accountId, apiToken } = getCredentials();
  const url = `https://api.cloudflare.com/client/v4/accounts/${accountId}/ai/run/${model}`;

  let response: Response;
  try {
    response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      cache: "no-store",
    });
  } catch (error) {
    throw new AiImageError("failed", `Cloudflare sorğusu uğursuz oldu (${model}): ${String(error)}`);
  }

  const envelope = (await response.json().catch(() => null)) as CloudflareEnvelope<T> | null;
  if (!response.ok || !envelope?.success || envelope.result === undefined) {
    const detail = envelope?.errors?.map((e) => `${e.code ?? "?"}: ${e.message ?? ""}`).join("; ");
    throw new AiImageError("failed", `Cloudflare ${model} xətası (HTTP ${response.status}) ${detail ?? ""}`.trim());
  }
  return envelope.result;
}

/** Postun başlığından və mətnindən FLUX üçün ingiliscə təsvir hazırlayır (LLM ilə). */
export async function buildImagePrompt(title: string, content: string): Promise<string> {
  const excerpt = content.replace(/\s+/g, " ").trim().slice(0, MAX_CONTENT_CHARS);
  const result = await runModel<{ response?: string }>(LLM_MODEL, {
    messages: [
      { role: "system", content: PROMPT_SYSTEM_MESSAGE },
      { role: "user", content: `Title: ${title.trim().slice(0, MAX_TITLE_CHARS)}\n\nExcerpt: ${excerpt}` },
    ],
    max_tokens: LLM_MAX_TOKENS,
  });

  const raw = result.response?.replace(/^["'\s]+|["'\s]+$/g, "") ?? "";
  const description = stripBrandNames(raw).slice(0, MAX_IMAGE_PROMPT_CHARS);
  if (!description) {
    throw new AiImageError("failed", "LLM boş təsvir qaytardı.");
  }
  return `${description} ${IMAGE_STYLE_SUFFIX}`;
}

export interface GeneratedImage {
  buffer: Buffer;
  contentType: "image/jpeg" | "image/png";
}

/** Təsvirdən FLUX-1-schnell ilə şəkil yaradır (cavab base64 `image` sahəsindədir). */
export async function generateImage(prompt: string): Promise<GeneratedImage> {
  const result = await runModel<{ image?: string }>(IMAGE_MODEL, { prompt, steps: FLUX_STEPS });
  if (!result.image) {
    throw new AiImageError("failed", "FLUX şəkil qaytarmadı.");
  }

  const buffer = Buffer.from(result.image, "base64");
  const isPng = buffer.length > 4 && buffer[0] === 0x89 && buffer[1] === 0x50;
  const isJpeg = buffer.length > 3 && buffer[0] === 0xff && buffer[1] === 0xd8;
  if (!isPng && !isJpeg) {
    throw new AiImageError("failed", "Alınan şəkil formatı tanınmadı.");
  }
  return { buffer, contentType: isPng ? "image/png" : "image/jpeg" };
}

/** Tam axın: mətn → təsvir → şəkil. */
export async function generateCoverImage(title: string, content: string): Promise<GeneratedImage> {
  const prompt = await buildImagePrompt(title, content);
  return generateImage(prompt);
}
