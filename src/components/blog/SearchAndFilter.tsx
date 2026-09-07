"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { BLOG_CATEGORIES } from "@/constants/blog";
import { useDebounce } from "@/hooks/useDebounce";

/**
 * Client Component (CSR):
 * Axtarış və kateqoriya filtrlərini idarə edən təmizlənmiş interfeys.
 * 
 * - Debounce məntiqi xüsusi 'useDebounce' hook-una həvalə edilib.
 * - Kateqoriyalar mərkəzi 'BLOG_CATEGORIES' sabitindən gəlir.
 */
export default function SearchAndFilter() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  // URL-dən cari parametrləri oxuyuruq
  const currentQuery = searchParams.get("q") ?? "";
  const currentCategory = searchParams.get("category") ?? "All";

  // İstifadəçinin daxil etdiyi yerli input mətni
  const [searchValue, setSearchValue] = useState(currentQuery);

  // useDebounce vasitəsilə 350ms gecikdirilmiş axtarış mətni
  const debouncedSearch = useDebounce(searchValue, 350);

  // URL kənardan dəyişərsə (məs. Sıfırla düyməsi və ya geri/irəli) yerli mətni sinxronlaşdırırıq
  useEffect(() => {
    setSearchValue(currentQuery);
  }, [currentQuery]);

  // URL-i yeniləyən köməkçi funksiya
  const updateUrl = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (!value || value === "All") {
      params.delete(key);
    } else {
      params.set(key, value);
    }

    startTransition(() => {
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    });
  };

  // Debounced dəyər dəyişdikdə URL-i yeniləyirik
  useEffect(() => {
    if (debouncedSearch.trim() !== currentQuery) {
      updateUrl("q", debouncedSearch.trim());
    }
  }, [debouncedSearch]);

  // Enter düyməsi basıldıqda gözləmədən dərhal axtarış icra edilsin
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      updateUrl("q", searchValue.trim());
    }
  };

  // Axtarış xanasını dərhal sıfırlayan düymə
  const handleClearSearch = () => {
    setSearchValue("");
    updateUrl("q", "");
  };

  // Kateqoriyaya klikləndikdə
  const handleCategoryClick = (category: string) => {
    if (currentCategory === category) {
      updateUrl("category", "All");
    } else {
      updateUrl("category", category);
    }
  };

  // Bütün filtrləri təmizləmək
  const handleReset = () => {
    setSearchValue("");
    startTransition(() => {
      router.replace(pathname, { scroll: false });
    });
  };

  const hasActiveFilters = Boolean(currentQuery || currentCategory !== "All");

  return (
    <div className="mb-10 space-y-5 bg-white p-6 sm:p-7 rounded-2xl border border-slate-200/80 shadow-[0_2px_10px_rgba(0,0,0,0.03)]">
      {/* 1. Axtarış Xanası */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        <input
          type="text"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Məqalələrdə axtarın (məsələn: Next.js, Docker, Clean Code)..."
          className="w-full pl-10 pr-10 py-3 bg-slate-50 hover:bg-slate-100/70 focus:bg-white text-sm text-slate-800 placeholder-slate-400 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
        />

        {/* Yüklənmə (Pending) animasiyası və ya təmizləmə düyməsi */}
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
          {isPending ? (
            <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          ) : searchValue ? (
            <button
              onClick={handleClearSearch}
              className="text-slate-400 hover:text-slate-600 text-xs font-bold p-1"
              title="Axtarışı təmizlə"
            >
              ✕
            </button>
          ) : null}
        </div>
      </div>

      {/* 2. Kateqoriya Düymələri */}
      <div className="flex flex-wrap items-center gap-2 pt-1">
        <span className="text-xs font-semibold text-slate-400 mr-1 uppercase tracking-wider">
          Filtr:
        </span>

        {BLOG_CATEGORIES.map((cat) => {
          const isSelected = (cat === "All" && currentCategory === "All") || currentCategory === cat;
          const label = cat === "All" ? "Hamısı" : cat;

          return (
            <button
              key={cat}
              onClick={() => handleCategoryClick(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 ${
                isSelected
                  ? "bg-blue-600 text-white shadow-sm ring-2 ring-blue-500/20"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900"
              }`}
            >
              {label}
            </button>
          );
        })}

        {/* Aktiv filtr varsa Sıfırla düyməsi */}
        {hasActiveFilters && (
          <button
            onClick={handleReset}
            className="ml-auto text-xs font-semibold text-rose-600 hover:text-rose-700 hover:underline px-2 py-1"
          >
            Filtrləri təmizlə ✕
          </button>
        )}
      </div>
    </div>
  );
}
