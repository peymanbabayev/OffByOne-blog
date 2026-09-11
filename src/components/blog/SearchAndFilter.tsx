"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import { BLOG_CATEGORIES } from "@/constants/blog";
import { useDictionary } from "@/i18n/client";

/**
 * Client Component:
 * Arxiv siyahısının axtarış (`?q=`) və kateqoriya (`?category=`) filtrini idarə edir.
 * Bu, saytüstü "sürətli keçid" (⌘K Spotlight) DEYİL — bu qutu cari siyahını filtrləyir.
 */
export default function SearchAndFilter() {
  const dict = useDictionary();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const currentQuery = searchParams.get("q")?.trim() ?? "";
  const currentCategory = searchParams.get("category") ?? "All";

  const [value, setValue] = useState(currentQuery);
  const [syncedQuery, setSyncedQuery] = useState(currentQuery);
  // Sonuncu bizim göndərdiyimiz `q` — öz debounce push-umuzu xarici dəyişiklikdən ayırmaq üçün
  const lastSentRef = useRef(currentQuery);

  // URL dəyişəndə: `syncedQuery`-ni yenilə, amma input mətnini YALNIZ xarici dəyişiklikdə
  // (Sıfırla, geri/irəli naviqasiya) köçür — istifadəçi yazmağa davam edərsə mətni pozma.
  if (currentQuery !== syncedQuery) {
    setSyncedQuery(currentQuery);
    if (currentQuery !== lastSentRef.current) {
      setValue(currentQuery);
    }
  }

  const updateParam = useCallback(
    (key: "q" | "category", next: string) => {
      if (key === "q") lastSentRef.current = next;
      const params = new URLSearchParams(searchParams.toString());
      if (!next || next === "All") params.delete(key);
      else params.set(key, next);
      const qs = params.toString();
      startTransition(() => {
        router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
      });
    },
    [pathname, router, searchParams]
  );

  // Debounce — yerli mətn URL-dəki `q`-dən fərqlənəndə 350ms sonra yenilə
  useEffect(() => {
    const trimmed = value.trim();
    if (trimmed === currentQuery) return;
    const id = setTimeout(() => updateParam("q", trimmed), 350);
    return () => clearTimeout(id);
  }, [value, currentQuery, updateParam]);

  const hasActiveFilters = Boolean(currentQuery || currentCategory !== "All");

  return (
    <div className="mb-6 space-y-3">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <label htmlFor="archive-search" className="sr-only">
            {dict.search.filterLabel}
          </label>
          <svg
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500"
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
          <input
            id="archive-search"
            type="search"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") updateParam("q", value.trim());
            }}
            placeholder={dict.search.placeholder}
            className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-9 text-sm text-slate-800 placeholder:text-slate-400 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500"
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2">
            {isPending ? (
              <span className="block h-3.5 w-3.5 animate-spin rounded-full border-2 border-accent border-t-transparent" />
            ) : value ? (
              <button
                type="button"
                onClick={() => {
                  setValue("");
                  updateParam("q", "");
                }}
                className="text-slate-400 hover:text-slate-700 dark:text-slate-500 dark:hover:text-slate-300"
                aria-label={dict.search.clearAria}
              >
                ✕
              </button>
            ) : null}
          </span>
        </div>
        <p className="hidden shrink-0 text-xs text-slate-400 sm:block dark:text-slate-500">
          {dict.search.siteWideHint}{" "}
          <kbd className="rounded border border-slate-200 bg-slate-50 px-1 font-sans text-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400">
            ⌘K
          </kbd>
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {BLOG_CATEGORIES.map((cat) => {
          const active = currentCategory === cat;
          return (
            <button
              key={cat}
              type="button"
              aria-pressed={active}
              onClick={() =>
                updateParam("category", currentCategory === cat ? "All" : cat)
              }
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                active
                  ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900"
                  : "border border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400 dark:hover:border-slate-600 dark:hover:text-slate-100"
              }`}
            >
              {cat === "All" ? dict.home.hamisi : cat}
            </button>
          );
        })}
        {hasActiveFilters && (
          <button
            type="button"
            onClick={() => {
              setValue("");
              lastSentRef.current = "";
              startTransition(() =>
                router.replace(pathname, { scroll: false })
              );
            }}
            className="ml-auto text-xs font-medium text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
          >
            {dict.search.resetLabel}
          </button>
        )}
      </div>
    </div>
  );
}
