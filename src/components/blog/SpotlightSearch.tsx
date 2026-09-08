"use client";

import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { paletteSearchAction } from "@/actions/posts";
import type { PostSummary } from "@/types/post";

/**
 * Client Component — ⌘K / Ctrl+K "Sürətli keçid" pəncərəsi.
 *
 * Bu, səhifədəki axtarış qutusundan FƏRQLİDİR: burada nəticəyə klik birbaşa yazıya aparır
 * (siyahını filtrləmir). Ən altdakı sətir "«{q}» üçün bütün nəticələr" isə `/?q=`-ə körpü qurur.
 */
export default function SpotlightSearch() {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<PostSummary[]>([]);
  const [selected, setSelected] = useState(0);
  const [isPending, startTransition] = useTransition();

  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const latestTermRef = useRef("");

  useEffect(() => {
    setMounted(true);
  }, []);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => {
    setIsOpen(false);
    setQuery("");
    setResults([]);
    setSelected(0);
    latestTermRef.current = "";
  }, []);

  const go = useCallback(
    (href: string) => {
      close();
      router.push(href);
    },
    [close, router]
  );

  // Qlobal ⌘K / Ctrl+K və navbar düyməsindən gələn custom event
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (isOpen) close();
        else open();
      }
    };
    const onOpen = () => open();
    window.addEventListener("keydown", onKey);
    window.addEventListener("open-spotlight", onOpen);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("open-spotlight", onOpen);
    };
  }, [isOpen, open, close]);

  // Açılış yan təsirləri: scroll-lock + fokus saxla/bərpa et (cleanup həmişə işləyir)
  useEffect(() => {
    if (!isOpen) return;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const focusTimer = window.setTimeout(() => inputRef.current?.focus(), 20);
    return () => {
      window.clearTimeout(focusTimer);
      document.body.style.overflow = prevOverflow;
      previouslyFocused?.focus?.();
    };
  }, [isOpen]);

  // Debounced axtarış + köhnə (stale) cavab qoruması — setState yalnız async callback-də
  useEffect(() => {
    const term = query.trim();
    latestTermRef.current = term;
    if (term.length < 2) return;
    const id = window.setTimeout(() => {
      startTransition(async () => {
        try {
          const data = await paletteSearchAction(term);
          if (latestTermRef.current === term) {
            setResults(data);
            setSelected(0);
          }
        } catch (err) {
          console.error("Spotlight axtarış xətası:", err);
        }
      });
    }, 200);
    return () => window.clearTimeout(id);
  }, [query]);

  // Seçilmiş sətri görünüşə sürüşdür
  useEffect(() => {
    listRef.current
      ?.querySelector<HTMLElement>(`[data-index="${selected}"]`)
      ?.scrollIntoView({ block: "nearest" });
  }, [selected]);

  if (!isOpen || !mounted) return null;

  const term = query.trim();
  const activeResults = term.length >= 2 ? results : [];
  const hasBridgeRow = term.length >= 2;
  const rowCount = activeResults.length + (hasBridgeRow ? 1 : 0);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      e.preventDefault();
      close();
    } else if (e.key === "ArrowDown" && rowCount > 0) {
      e.preventDefault();
      setSelected((i) => (i + 1) % rowCount);
    } else if (e.key === "ArrowUp" && rowCount > 0) {
      e.preventDefault();
      setSelected((i) => (i - 1 + rowCount) % rowCount);
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (selected < activeResults.length) {
        go(`/blog/${activeResults[selected].slug}`);
      } else if (hasBridgeRow) {
        go(`/?q=${encodeURIComponent(term)}`);
      }
    }
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center bg-slate-900/40 px-4 pt-[12vh] backdrop-blur-sm"
      onClick={close}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Sürətli keçid"
        className="w-full max-w-xl overflow-hidden rounded-card border border-slate-200 bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={onKeyDown}
      >
        <div className="flex items-center gap-2.5 border-b border-slate-100 px-4 py-3">
          <svg
            className="h-4 w-4 shrink-0 text-slate-400"
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
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Yazı adını yaz…"
            aria-label="Yazı axtar"
            className="w-full bg-transparent text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
          />
          {isPending && (
            <span className="h-3.5 w-3.5 shrink-0 animate-spin rounded-full border-2 border-accent border-t-transparent" />
          )}
          <kbd className="hidden shrink-0 rounded border border-slate-200 bg-slate-50 px-1.5 py-0.5 text-[10px] font-medium text-slate-400 sm:block">
            ESC
          </kbd>
        </div>

        <div ref={listRef} className="max-h-[52vh] overflow-y-auto p-1.5">
          {term.length < 2 ? (
            <p className="px-3 py-6 text-center text-xs text-slate-400">
              Axtarmaq üçün ən azı 2 hərf yazın.
            </p>
          ) : (
            <>
              {activeResults.map((post, i) => (
                <button
                  key={post.slug}
                  type="button"
                  data-index={i}
                  onMouseMove={() => setSelected(i)}
                  onClick={() => go(`/blog/${post.slug}`)}
                  className={`flex w-full flex-col items-start gap-0.5 rounded-lg px-3 py-2 text-left transition-colors ${
                    selected === i ? "bg-slate-100" : "hover:bg-slate-50"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span className="inline-flex items-center rounded border border-slate-200 bg-slate-100 px-1.5 text-[10px] font-medium text-slate-600">
                      {post.category}
                    </span>
                    <span className="text-sm font-medium text-slate-900 line-clamp-1">
                      {post.title}
                    </span>
                  </span>
                  <span className="text-xs text-slate-500 line-clamp-1">
                    {post.excerpt}
                  </span>
                </button>
              ))}

              {activeResults.length === 0 && !isPending && (
                <p className="px-3 py-6 text-center text-xs text-slate-400">
                  &laquo;{term}&raquo; üzrə nəticə yoxdur.
                </p>
              )}

              <button
                type="button"
                data-index={activeResults.length}
                onMouseMove={() => setSelected(activeResults.length)}
                onClick={() => go(`/?q=${encodeURIComponent(term)}`)}
                className={`mt-1 flex w-full items-center justify-between rounded-lg border-t border-slate-100 px-3 py-2 text-xs font-medium transition-colors ${
                  selected === activeResults.length
                    ? "bg-slate-100 text-slate-900"
                    : "text-slate-500 hover:bg-slate-50"
                }`}
              >
                <span>&laquo;{term}&raquo; üçün bütün nəticələr</span>
                <span aria-hidden>→</span>
              </button>
            </>
          )}
        </div>

        <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50 px-4 py-2 text-[11px] text-slate-400">
          <span>
            <kbd className="font-sans">↑</kbd> <kbd className="font-sans">↓</kbd>{" "}
            naviqasiya · <kbd className="font-sans">↵</kbd> aç
          </span>
          <span>Sürətli keçid</span>
        </div>
      </div>
    </div>,
    document.body
  );
}
