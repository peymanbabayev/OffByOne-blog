import "server-only";
import { defaultLocale, isLocale, type Locale } from "./config";

/**
 * Server Actions cannot use `next/root-params` (per Next.js docs). Forms
 * that need the locale for a post-submit redirect or a localized validation
 * message carry it as a hidden `lang` field (same pattern this codebase
 * already uses for `from`); actions read it back through this helper.
 */
export function localeFromFormData(formData: FormData): Locale {
  const raw = formData.get("lang")?.toString();
  return isLocale(raw) ? raw : defaultLocale;
}
