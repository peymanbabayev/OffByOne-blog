/**
 * Açıq yönləndirmə (open redirect) qoruması.
 *
 * `?from=` kimi istifadəçi tərəfindən idarə oluna bilən dəyərlər birbaşa
 * `redirect()`-ə verilməməlidir. Bu funksiya yalnız təhlükəsiz DAXİLİ yol
 * (relative path) qaytarır; xarici URL, protokol-nisbi (`//host`) və ya
 * etibarsız dəyər üçün defolt yola qayıdır.
 */
const DEFAULT_REDIRECT = "/";

export function sanitizeRedirectPath(
  raw: string | null | undefined,
  fallback: string = DEFAULT_REDIRECT,
): string {
  if (
    !raw ||
    !raw.startsWith("/") ||
    raw.startsWith("//") ||
    raw.startsWith("/\\")
  ) {
    return fallback;
  }

  try {
    // Baza kimi süni host veririk — `raw` daxili yol olsa `origin` dəyişməməlidir.
    const url = new URL(raw, "http://internal.local");
    if (url.origin !== "http://internal.local") {
      return fallback;
    }
    return url.pathname + url.search;
  } catch {
    return fallback;
  }
}
