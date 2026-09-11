"use client";

import { createContext, useContext, useMemo } from "react";
import type { Locale } from "./config";
import type { Dictionary } from "./types";

interface I18nContextValue {
  lang: Locale;
  dict: Dictionary;
}

const I18nContext = createContext<I18nContextValue | null>(null);

/**
 * Client-side bridge for the dictionary: `next/root-params` only works in
 * Server Components, so the root layout (a Server Component) resolves
 * `{ lang, dict }` once and hands it down through this provider. Any Client
 * Component anywhere below — regardless of whether its immediate parent is
 * a Server or Client Component — can then call `useDictionary()`/`useLang()`.
 */
export function I18nProvider({
  lang,
  dict,
  children,
}: {
  lang: Locale;
  dict: Dictionary;
  children: React.ReactNode;
}) {
  const value = useMemo(() => ({ lang, dict }), [lang, dict]);
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

function useI18n(): I18nContextValue {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    throw new Error("useDictionary/useLang must be used within <I18nProvider>.");
  }
  return ctx;
}

/** Current locale (`"az" | "en" | "ru"`) inside a Client Component. */
export function useLang(): Locale {
  return useI18n().lang;
}

/** Full translated dictionary inside a Client Component. */
export function useDictionary(): Dictionary {
  return useI18n().dict;
}
