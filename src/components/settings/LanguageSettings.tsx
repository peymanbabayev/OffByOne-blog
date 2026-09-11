"use client";

import { locales, localeLabels } from "@/i18n/config";
import { useDictionary } from "@/i18n/client";
import { useLanguageSwitch } from "@/i18n/useLanguageSwitch";

/**
 * Tənzimləmələr → "Dil" bölməsi: az/en/ru arasında sürüşən seçici.
 * Naviqasiya çubuğundakı `LanguageSwitcher` ilə eyni `useLanguageSwitch` hook-unu paylaşır.
 */
export default function LanguageSettings() {
  const dict = useDictionary();
  const { lang, switchTo, isPending } = useLanguageSwitch();

  return (
    <div className="inline-flex items-center gap-2">
      <div
        role="radiogroup"
        aria-label={dict.language.label}
        aria-busy={isPending}
        className={`inline-flex flex-wrap rounded-xl bg-slate-100 p-1 text-sm transition-opacity dark:bg-slate-800 ${
          isPending ? "opacity-60" : ""
        }`}
      >
        {locales.map((l) => {
          const active = lang === l;
          return (
            <button
              key={l}
              type="button"
              role="radio"
              aria-checked={active}
              disabled={isPending}
              onClick={() => switchTo(l)}
              className={`rounded-lg px-4 py-1.5 font-semibold transition-colors disabled:cursor-not-allowed ${
                active
                  ? "bg-white text-slate-900 shadow-sm dark:bg-slate-700 dark:text-slate-50"
                  : "text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
              }`}
            >
              {localeLabels[l]}
            </button>
          );
        })}
      </div>
      {isPending && (
        <span
          className="block h-3.5 w-3.5 shrink-0 animate-spin rounded-full border-2 border-accent border-t-transparent"
          aria-hidden="true"
        />
      )}
    </div>
  );
}
