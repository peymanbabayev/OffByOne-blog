import "server-only";

import { del } from "@vercel/blob";
import { isBlobUrl } from "@/lib/image";

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
export async function deleteBlob(url: string | null | undefined): Promise<void> {
  if (!isBlobUrl(url)) return;
  try {
    await del(url);
  } catch (error) {
    console.error("Blob silinərkən xəta (əsas əməliyyat davam edir):", error);
  }
}
