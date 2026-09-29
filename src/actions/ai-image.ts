"use server";

import { requireAuth } from "@/lib/auth";
import { AiImageError, generateCoverImage, isAiImageConfigured } from "@/lib/ai-image";
import { AI_IMAGE_MIN_CONTENT_CHARS } from "@/lib/image";
import { refundGeneration, reserveGeneration } from "@/lib/ai-image-quota";
import { putImageBuffer } from "@/lib/blob";

export type GenerateCoverImageErrorCode =
  | "unauthorized"
  | "invalid_input"
  | "too_short"
  | "not_configured"
  | "user_limit"
  | "global_limit"
  | "failed";

export type GenerateCoverImageResult =
  | { ok: true; url: string; remaining: number }
  | { ok: false; code: GenerateCoverImageErrorCode; limit?: number; min?: number };

/**
 * Server Action: postun başlığı və mətnindən AI ilə örtük şəkli yaradır, Blob-a yükləyir və URL-i qaytarır.
 * Xəta mesajları client-də lüğətdən götürülür — burada yalnız kod qaytarılır.
 * Birbaşa POST ilə də çağırıla bildiyi üçün sessiya və giriş məlumatları burada yoxlanılır.
 */
export async function generateCoverImageAction(input: {
  title: string;
  content: string;
}): Promise<GenerateCoverImageResult> {
  let userId: string;
  try {
    userId = (await requireAuth()).id;
  } catch {
    return { ok: false, code: "unauthorized" };
  }

  if (typeof input?.title !== "string" || typeof input?.content !== "string") {
    return { ok: false, code: "invalid_input" };
  }
  const title = input.title.trim();
  const content = input.content.trim();
  if (!title || content.length < AI_IMAGE_MIN_CONTENT_CHARS) {
    return { ok: false, code: "too_short", min: AI_IMAGE_MIN_CONTENT_CHARS };
  }

  if (!isAiImageConfigured()) {
    return { ok: false, code: "not_configured" };
  }

  let reservation: Awaited<ReturnType<typeof reserveGeneration>>;
  try {
    reservation = await reserveGeneration(userId);
  } catch (error) {
    console.error("AI şəkil kvotası yoxlanılarkən xəta:", error);
    return { ok: false, code: "failed" };
  }
  if (!reservation.ok) {
    return { ok: false, code: reservation.reason, limit: reservation.limit };
  }

  try {
    const image = await generateCoverImage(title, content);
    const url = await putImageBuffer("cover", image.buffer, image.contentType);
    return { ok: true, url, remaining: reservation.remaining };
  } catch (error) {
    console.error("AI örtük şəkli yaradılarkən xəta:", error);
    try {
      await refundGeneration(reservation.generationId);
    } catch (refundError) {
      console.error("AI şəkil kvotası geri qaytarılarkən xəta:", refundError);
    }
    const notConfigured = error instanceof AiImageError && error.code === "not_configured";
    return { ok: false, code: notConfigured ? "not_configured" : "failed" };
  }
}
