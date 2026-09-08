"use client";

import { useSyncExternalStore } from "react";
import SpotlightSearch from "./SpotlightSearch";

const noop = () => () => {};

/** SSR təhlükəsiz platforma yoxlaması — effektdə setState yoxdur, hydration mismatch yoxdur. */
function useIsMac(): boolean {
  return useSyncExternalStore(
    noop,
    () => /mac/i.test(navigator.userAgent),
    () => false
  );
}

/**
 * Navbar-dakı "Axtar" düyməsi — ⌘K / Ctrl+K Spotlight pəncərəsini açır.
 * Pəncərənin özü (`SpotlightSearch`) qlobal olaraq bu komponentlə birlikdə render olunur.
 */
export default function SpotlightTrigger() {
  const isMac = useIsMac();

  return (
    <>
      <button
        type="button"
        onClick={() => window.dispatchEvent(new CustomEvent("open-spotlight"))}
        aria-label="Yazıları axtar"
        className="hidden items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-medium text-slate-500 transition-colors hover:border-slate-300 hover:text-slate-900 sm:flex"
      >
        <svg
          className="h-3.5 w-3.5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M21 21l-4.35-4.35M17 10a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <span className="hidden sm:inline">Axtar</span>
        <kbd className="rounded border border-slate-200 bg-white px-1 py-0.5 text-[10px] font-medium text-slate-400">
          {isMac ? "⌘K" : "Ctrl K"}
        </kbd>
      </button>

      <SpotlightSearch />
    </>
  );
}
