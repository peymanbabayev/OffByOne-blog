"use client";

import { useId } from "react";
import { useDictionary } from "@/i18n/client";

type View = "grid" | "index";

const VIEW_VALUES: View[] = ["grid", "index"];

// Lucide `layout-grid` / `list` — dolğun variantlar (statik, dildən asılı deyil)
const ICONS: Record<View, React.ReactNode> = {
  grid: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden>
      <rect x="3" y="3" width="8" height="8" rx="2.5" />
      <rect x="13" y="3" width="8" height="8" rx="2.5" />
      <rect x="3" y="13" width="8" height="8" rx="2.5" />
      <rect x="13" y="13" width="8" height="8" rx="2.5" />
    </svg>
  ),
  index: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden>
      <circle cx="4.5" cy="6" r="1.5" />
      <circle cx="4.5" cy="12" r="1.5" />
      <circle cx="4.5" cy="18" r="1.5" />
      <rect x="8" y="4.75" width="13" height="2.5" rx="1.25" />
      <rect x="8" y="10.75" width="13" height="2.5" rx="1.25" />
      <rect x="8" y="16.75" width="13" height="2.5" rx="1.25" />
    </svg>
  ),
};

interface ViewToggleProps {
  value: View;
  onChange: (value: View) => void;
}

/**
 * Client Component — yalnız prezentasiya rejimini dəyişir (grid ↔ index).
 * Data yenidən çəkilmir; seçimi `PostArchive` `localStorage`-də saxlayır.
 *
 * Radiogroup pattern: ← → düymələri ilə naviqasiya, sürüşən indikator.
 */
export default function ViewToggle({ value, onChange }: ViewToggleProps) {
  const dict = useDictionary();
  const groupId = useId();

  const options = [
    { value: "grid" as const, label: dict.viewToggle.gridLabel, hint: dict.viewToggle.gridHint },
    { value: "index" as const, label: dict.viewToggle.listLabel, hint: dict.viewToggle.listHint },
  ];
  const activeIndex = VIEW_VALUES.indexOf(value);

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
    e.preventDefault();
    const dir = e.key === "ArrowRight" ? 1 : -1;
    const next = (activeIndex + dir + VIEW_VALUES.length) % VIEW_VALUES.length;
    onChange(VIEW_VALUES[next]);
  }

  return (
    <div
      role="radiogroup"
      aria-label={dict.viewToggle.groupAria}
      onKeyDown={handleKeyDown}
      className="relative inline-flex rounded-lg bg-slate-100 p-1 ring-1 ring-inset ring-slate-200 dark:bg-slate-800 dark:ring-slate-700"
    >
      {/* Sürüşən indikator */}
      <span
        aria-hidden
        className="absolute inset-y-1 left-1 rounded-md bg-white shadow-sm ring-1 ring-slate-900/5 transition-transform duration-200 ease-out dark:bg-slate-700 dark:ring-white/10"
        style={{
          width: `calc((100% - 0.5rem) / ${options.length})`,
          transform: `translateX(${activeIndex * 100}%)`,
        }}
      />

      {options.map((opt) => {
        const active = value === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            role="radio"
            aria-checked={active}
            aria-label={opt.hint}
            tabIndex={active ? 0 : -1}
            onClick={() => onChange(opt.value)}
            className={`relative z-10 inline-flex flex-1 basis-0 items-center justify-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-semibold outline-none transition-colors focus-visible:ring-2 focus-visible:ring-slate-900/20 sm:px-3 ${
              active
                ? "text-slate-900 dark:text-slate-50"
                : "text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
            }`}
          >
            {ICONS[opt.value]}
            <span className="hidden sm:inline" id={`${groupId}-${opt.value}`}>
              {opt.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
