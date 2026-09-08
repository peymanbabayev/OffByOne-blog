/**
 * Şəkil yükləmə üçün ortaq qaydalar (post örtük şəkli + avatar).
 *
 * Bu fayl həm client komponentlərində (`ImageUpload`), həm route handler-də,
 * həm də zod sxemlərində istifadə olunur — ona görə `server-only` DEYİL və
 * `@vercel/blob` idxal ETMİR. Faktiki silmə üçün server tərəfli `@/lib/blob`-a bax.
 */

/** Client `upload()` və server token yoxlaması üçün icazəli MIME tipləri. */
export const IMAGE_CONTENT_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
] as const;

/** Maksimum şəkil ölçüsü — 5 MB. Client seçimdə və server token-də tətbiq olunur. */
export const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

/** İnsan üçün oxunaqlı limit mesajı. */
export const MAX_IMAGE_LABEL = "5 MB";

/** Yüklənən şəklin növü — Blob içində qovluq prefiksini təyin edir. */
export type ImageKind = "cover" | "avatar";

export const IMAGE_KIND_PREFIX: Record<ImageKind, string> = {
  cover: "covers",
  avatar: "avatars",
};

export function isImageKind(value: string | null | undefined): value is ImageKind {
  return value === "cover" || value === "avatar";
}

/**
 * Dəyər bizim Blob store-a aid ictimai URL-dirsə `true`.
 * Həm zod validasiyasında, həm də köhnə faylı silməzdən əvvəl istifadə olunur.
 */
export function isBlobUrl(value: string | null | undefined): value is string {
  if (!value) return false;
  try {
    const { protocol, hostname } = new URL(value);
    return (
      protocol === "https:" && hostname.endsWith(".public.blob.vercel-storage.com")
    );
  } catch {
    return false;
  }
}

/** Fayl adını Blob pathname üçün təhlükəsiz hala salır (qovluq prefiksi ilə). */
export function buildUploadPath(kind: ImageKind, fileName: string): string {
  const dot = fileName.lastIndexOf(".");
  const ext = dot >= 0 ? fileName.slice(dot + 1).toLowerCase().replace(/[^a-z0-9]/g, "") : "";
  const base = (dot >= 0 ? fileName.slice(0, dot) : fileName)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40) || "image";
  return `${IMAGE_KIND_PREFIX[kind]}/${base}${ext ? `.${ext}` : ""}`;
}
