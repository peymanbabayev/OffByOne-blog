import "server-only";

import { del, put } from "@vercel/blob";
import { buildUploadPath, isBlobUrl, MAX_IMAGE_BYTES, type ImageKind } from "@/lib/image";

/**
 * Server tərəfli Blob əməliyyatları. Ortaq sabitlər və `isBlobUrl` üçün
 * `@/lib/image`-ə bax (o, client-də də işləyir).
 */

/**
 * Köhnə/istifadədən çıxmış blobu təhlükəsiz silir.
 * - Bizim Blob URL-i deyilsə heç nə etmir (kənar URL-lərə `del()` çağırmırıq).
 * - Silmə xətası əsas əməliyyatı (post yenilənməsi/silinməsi) pozmamalıdır —
 *   ona görə xəta udulur və yalnız loglanır.
 */
/**
 * Serverdə yaradılmış şəkli (məs. AI generasiyası) Blob-a yükləyir və ictimai URL-i qaytarır.
 * Client yükləməsi ilə eyni qovluq, ad qaydası və ölçü limiti tətbiq olunur.
 */
export async function putImageBuffer(
  kind: ImageKind,
  buffer: Buffer,
  contentType: "image/jpeg" | "image/png",
): Promise<string> {
  if (buffer.length > MAX_IMAGE_BYTES) {
    throw new Error(`Şəkil ölçüsü limiti aşır (${buffer.length} bayt).`);
  }
  const fileName = contentType === "image/png" ? "ai-cover.png" : "ai-cover.jpg";
  const blob = await put(buildUploadPath(kind, fileName), buffer, {
    access: "public",
    addRandomSuffix: true,
    contentType,
  });
  return blob.url;
}

export async function deleteBlob(url: string | null | undefined): Promise<void> {
  if (!isBlobUrl(url)) return;
  try {
    await del(url);
  } catch (error) {
    console.error("Blob silinərkən xəta (əsas əməliyyat davam edir):", error);
  }
}
