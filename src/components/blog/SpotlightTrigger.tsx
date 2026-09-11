"use client";

import { useSyncExternalStore } from "react";
import SpotlightSearch from "./SpotlightSearch";
import { useDictionary } from "@/i18n/client";

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
  const dict = useDictionary();
  const isMac = useIsMac();

  return (
    <>
      <button
        type="button"
        onClick={() => window.dispatchEvent(new CustomEvent("open-spotlight"))}
        aria-label={dict.spotlight.triggerAria}
        className="hidden items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-medium text-slate-500 transition-colors hover:border-slate-300 hover:text-slate-900 sm:flex dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-400 dark:hover:border-slate-600 dark:hover:text-slate-100"
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
        <span className="hidden sm:inline">{dict.nav.search}</span>
        <kbd className="rounded border border-slate-200 bg-white px-1 py-0.5 text-[10px] font-medium text-slate-400 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-500">
          {isMac ? "⌘K" : "Ctrl K"}
        </kbd>
      </button>

      <SpotlightSearch />
    </>
  );
}
