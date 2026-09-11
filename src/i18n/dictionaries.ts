import "server-only";
import { lang as rootLang } from "next/root-params";
import { notFound } from "next/navigation";
import { isLocale, defaultLocale, type Locale } from "./config";
import type { Dictionary } from "./types";
import az from "./dictionaries/az";
import en from "./dictionaries/en";
import ru from "./dictionaries/ru";

const dictionaries: Record<Locale, Dictionary> = { az, en, ru };

/**
 * Explicit-locale variant — Server Actions, `generateMetadata`, and route
 * handlers cannot use `next/root-params`, so they resolve the locale
 * themselves (form field, `params`, cookie) and call this instead.
 */
export function getDictionaryFor(locale: Locale): Dictionary {
  return dictionaries[locale];
}

/**
 * Zero-prop-drilling variant for Server Components and server-side
 * utilities: reads the `[lang]` root segment directly via `next/root-params`.
 * 404s if the segment somehow isn't one of our supported locales.
 */
export async function getDictionary(): Promise<Dictionary> {
  const raw = await rootLang();
  if (!isLocale(raw)) notFound();
  return getDictionaryFor(raw);
}

/** Convenience: current locale without pulling the whole dictionary. */
export async function getLang(): Promise<Locale> {
  const raw = await rootLang();
  return isLocale(raw) ? raw : defaultLocale;
}
