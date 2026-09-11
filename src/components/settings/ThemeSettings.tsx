"use client";

import { useTheme } from "@/theme/useTheme";
import { THEME_PREFERENCES, type ThemePreference } from "@/theme/config";
import { useDictionary } from "@/i18n/client";

/**
 * Tənzimləmələr → "Görünüş" bölməsi: Light/Dark/System arasında sürüşən seçici.
 * Naviqasiya çubuğundakı `ThemeToggle` ilə eyni `useTheme()` hook-unu paylaşır —
 * hər ikisi eyni `localStorage` açarından oxuyub yazır, ona görə həmişə sinxrondur
 * (digər açıq tablar da daxil — bax: theme/useTheme.ts).
 */
export default function ThemeSettings() {
  const dict = useDictionary();
  const { preference, setPreference } = useTheme();

  const labels: Record<ThemePreference, string> = {
    light: dict.theme.light,
    dark: dict.theme.dark,
    system: dict.theme.system,
  };
  const options = THEME_PREFERENCES.map((value) => ({ value, label: labels[value] }));

  return (
    <div
      role="radiogroup"
      aria-label={dict.theme.label}
      className="inline-flex rounded-xl bg-slate-100 p-1 text-sm dark:bg-slate-800"
    >
      {options.map((opt) => {
        const active = preference === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => setPreference(opt.value)}
            className={`rounded-lg px-4 py-1.5 font-semibold transition-colors ${
              active
                ? "bg-white text-slate-900 shadow-sm dark:bg-slate-700 dark:text-slate-50"
                : "text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
            }`}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
