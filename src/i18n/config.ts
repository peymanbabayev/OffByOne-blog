/**
 * i18n konfiqurasiyası — dəstəklənən dillər və defolt dil.
 *
 * Marşrutlama `app/[lang]/...` altında qurulub (bax: proxy.ts + Next.js
 * "Internationalization" bələdçisi). Bu fayl tək mənbədir (single source of
 * truth) — həm proxy, həm dictionary loader, həm də client komponentləri
 * buradan qidalanır.
 */
export const locales = ["az", "en", "ru"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "az";

/** İstifadəçinin əl ilə seçdiyi dili yadda saxlayan cookie adı. */
export const LOCALE_COOKIE_NAME = "NEXT_LOCALE";

/** Cookie ömrü — 1 il (saniyə). */
export const LOCALE_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

export function isLocale(value: string | null | undefined): value is Locale {
  return !!value && (locales as readonly string[]).includes(value);
}

/** `formData`/cookie-dən gələn xam dəyəri təhlükəsiz `Locale`-ə çevirir. */
export function toLocale(value: string | null | undefined): Locale {
  return isLocale(value) ? value : defaultLocale;
}

/** Dillərin öz adları ilə göstərilməsi üçün (dil seçicidə istifadə olunur). */
export const localeLabels: Record<Locale, string> = {
  az: "Azərbaycanca",
  en: "English",
  ru: "Русский",
};

/** Naviqasiya bar-ında göstərilən qısa bayraq/kod (ixtiyari, kompakt UI üçün). */
export const localeShortLabels: Record<Locale, string> = {
  az: "AZ",
  en: "EN",
  ru: "RU",
};
