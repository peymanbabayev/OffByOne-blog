"use client";

import { useId } from "react";

type View = "grid" | "index";

const OPTIONS: {
  value: View;
  label: string;
  hint: string;
  icon: React.ReactNode;
}[] = [
  {
    value: "grid",
    label: "Kart",
    hint: "Kart görünüşü",
    // Lucide `layout-grid` — dolğun variant
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        className="h-4 w-4"
        aria-hidden
      >
        <rect x="3" y="3" width="8" height="8" rx="2.5" />
        <rect x="13" y="3" width="8" height="8" rx="2.5" />
        <rect x="3" y="13" width="8" height="8" rx="2.5" />
        <rect x="13" y="13" width="8" height="8" rx="2.5" />
      </svg>
    ),
  },
  {
    value: "index",
    label: "Siyahı",
    hint: "Siyahı görünüşü",
    // Lucide `list` — dolğun variant (bullet + sətir)
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        className="h-4 w-4"
        aria-hidden
      >
        <circle cx="4.5" cy="6" r="1.5" />
        <circle cx="4.5" cy="12" r="1.5" />
        <circle cx="4.5" cy="18" r="1.5" />
        <rect x="8" y="4.75" width="13" height="2.5" rx="1.25" />
        <rect x="8" y="10.75" width="13" height="2.5" rx="1.25" />
        <rect x="8" y="16.75" width="13" height="2.5" rx="1.25" />
      </svg>
    ),
  },
];

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
  const groupId = useId();
  const activeIndex = OPTIONS.findIndex((o) => o.value === value);

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
    e.preventDefault();
    const dir = e.key === "ArrowRight" ? 1 : -1;
    const next = (activeIndex + dir + OPTIONS.length) % OPTIONS.length;
    onChange(OPTIONS[next].value);
  }

  return (
    <div
      role="radiogroup"
      aria-label="Görünüş rejimi"
      onKeyDown={handleKeyDown}
      className="relative inline-flex rounded-lg bg-slate-100 p-1 ring-1 ring-inset ring-slate-200"
    >
      {/* Sürüşən indikator */}
      <span
        aria-hidden
        className="absolute inset-y-1 left-1 rounded-md bg-white shadow-sm ring-1 ring-slate-900/5 transition-transform duration-200 ease-out"
        style={{
          width: `calc((100% - 0.5rem) / ${OPTIONS.length})`,
          transform: `translateX(${activeIndex * 100}%)`,
        }}
      />

      {OPTIONS.map((opt) => {
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
              active ? "text-slate-900" : "text-slate-500 hover:text-slate-800"
            }`}
          >
            {opt.icon}
            <span className="hidden sm:inline" id={`${groupId}-${opt.value}`}>
              {opt.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
