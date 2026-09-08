/**
 * Mətnin təxmini oxuma müddətini dəqiqə ilə qaytarır.
 * Orta oxuma sürəti ~180 söz/dəqiqə (texniki məzmun üçün mühafizəkar dəyər).
 * Minimum 1 dəqiqə.
 */
export function estimateReadingTime(text: string | null | undefined): number {
  if (!text) return 1;
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 180));
}
