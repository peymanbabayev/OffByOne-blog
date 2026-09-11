import type { Locale } from "./config";
import az from "./dictionaries/az";
import en from "./dictionaries/en";
import ru from "./dictionaries/ru";

const monthTables: Record<Locale, { full: readonly string[]; short: readonly string[] }> = {
  az: { full: az.months, short: az.monthsShort },
  en: { full: en.months, short: en.monthsShort },
  ru: { full: ru.months, short: ru.monthsShort },
};

function toDate(input: Date | string): Date {
  return typeof input === "string" ? new Date(input) : input;
}

/**
 * Deterministic, locale-aware "8 September 2026" formatting.
 *
 * `Date.prototype.toLocaleDateString()` depends on the runtime's ICU data,
 * which differs between Node (server) and the browser (client) and between
 * server environments — causing hydration mismatches for Client Components
 * and non-deterministic output for Server Components. Formatting by hand
 * from UTC components sidesteps this (see the Next.js "Preventing Flash
 * Before Hydration" guide). Day-month-year order is used for all three
 * locales so switching languages doesn't also reorder the date.
 */
export function formatLocaleDate(input: Date | string, locale: Locale): string {
  const d = toDate(input);
  const { full } = monthTables[locale];
  return `${d.getUTCDate()} ${full[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
}

/** Compact "Sep 2026" form — used where space is tight (e.g. the author card). */
export function formatMonthYear(input: Date | string, locale: Locale): string {
  const d = toDate(input);
  const { short } = monthTables[locale];
  return `${short[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
}
