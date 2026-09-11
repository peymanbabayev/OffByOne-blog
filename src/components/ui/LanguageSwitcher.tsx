"use client";

import { useEffect, useId, useRef, useState } from "react";
import { locales, localeLabels, localeShortLabels } from "@/i18n/config";
import { useDictionary } from "@/i18n/client";
import { useLanguageSwitch } from "@/i18n/useLanguageSwitch";

/**
 * Navbar-dakı dil seçici — cari səhifəni saxlayaraq yalnız `[lang]` seqmentini
 * dəyişir. Seçim `NEXT_LOCALE` cookie-də saxlanılır ki, sonrakı ziyarətlərdə
 * (proxy.ts) həmin dil default kimi seçilsin. Keçid məntiqi `useLanguageSwitch`-dədir
 * (bax: ora — qəsdən `useSearchParams()` işlətmir, çünki bu komponent hər
 * səhifədə (Navbar → kök layout) render olunur).
 */
export default function LanguageSwitcher() {
  const dict = useDictionary();
  const { lang, switchTo, isPending } = useLanguageSwitch();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const menuId = useId();

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={menuId}
        aria-label={dict.language.switchAria}
        title={dict.language.label}
        className="flex h-8 items-center gap-1 rounded-lg px-2 text-xs font-semibold text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
      >
        {isPending ? (
          <span className="block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        ) : (
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" aria-hidden>
            <circle cx="12" cy="12" r="9" />
            <path strokeLinecap="round" d="M3 12h18M12 3c2.5 2.7 3.8 6 3.8 9s-1.3 6.3-3.8 9c-2.5-2.7-3.8-6-3.8-9S9.5 5.7 12 3z" />
          </svg>
        )}
        <span>{localeShortLabels[lang]}</span>
      </button>

      {open && (
        <div
          id={menuId}
          role="menu"
          className="absolute right-0 z-40 mt-2 w-44 overflow-hidden rounded-card border border-slate-200 bg-white p-1.5 shadow-lg dark:border-slate-700 dark:bg-slate-900"
        >
          {locales.map((l) => (
            <button
              key={l}
              type="button"
              role="menuitemradio"
              aria-checked={lang === l}
              onClick={() => {
                switchTo(l);
                setOpen(false);
              }}
              className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                lang === l
                  ? "bg-slate-100 font-semibold text-slate-900 dark:bg-slate-800 dark:text-slate-50"
                  : "text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800/60"
              }`}
            >
              <span>{localeLabels[l]}</span>
              <span className="text-[10px] font-medium text-slate-400 dark:text-slate-500">{localeShortLabels[l]}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
