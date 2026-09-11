import "server-only";
import { redirect } from "next/navigation";
import { lang as rootLang } from "next/root-params";
import { toLocale } from "./config";

/**
 * Locale-prefixed `redirect()` for Server Components and server-side
 * utilities (e.g. `lib/auth.ts`) that don't already have `lang` in hand.
 * Reads the current `[lang]` segment via `next/root-params` and prefixes
 * `path` with it before delegating to `next/navigation`'s `redirect()`.
 */
export async function redirectWithLocale(path: string): Promise<never> {
  const locale = toLocale(await rootLang());
  redirect(`/${locale}${path}`);
}
