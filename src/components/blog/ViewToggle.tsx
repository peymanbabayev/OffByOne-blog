"use client";

type View = "grid" | "index";

const OPTIONS: { value: View; label: string }[] = [
  { value: "grid", label: "Qrid" },
  { value: "index", label: "İndeks" },
];

interface ViewToggleProps {
  value: View;
  onChange: (value: View) => void;
}

/**
 * Client Component — yalnız prezentasiya rejimini dəyişir (grid ↔ index).
 * Data yenidən çəkilmir; seçimi `PostArchive` `localStorage`-də saxlayır.
 */
export default function ViewToggle({ value, onChange }: ViewToggleProps) {
  return (
    <div
      role="group"
      aria-label="Görünüş rejimi"
      className="inline-flex rounded-lg border border-slate-200 bg-slate-50 p-0.5"
    >
      {OPTIONS.map((opt) => {
        const active = value === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(opt.value)}
            className={`rounded-md px-3 py-1 text-xs font-semibold transition-colors ${
              active
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
