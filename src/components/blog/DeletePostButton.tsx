"use client";

import { useActionState, useState, useEffect, useRef } from "react";
import { deletePostAction } from "@/actions/posts";

interface DeletePostButtonProps {
  postId: string;
  redirectTo?: string;
}

/**
 * Client Component: GPU-accelerated ultra-smooth inline confirmation.
 *
 * Tutulma (jank/reflow) səbəbləri tam aradan qaldırıldı:
 * 1. `max-width` yerinə müasir CSS Grid (`0fr -> 1fr`) kompozisiyası istifadə olunur.
 * 2. Mətn sıçramasının qarşısını almaq üçün "Sil" və "Təsdiq" vertikal roll (odometer)
 *    effekti ilə GPU səviyyəsində (`transform: translateY`, `opacity`) cross-fade edir.
 * 3. Bütün keçidlər `transform-gpu` ilə hardware-accelerated icra olunur.
 */
export default function DeletePostButton({
  postId,
  redirectTo,
}: DeletePostButtonProps) {
  const [armed, setArmed] = useState(false);
  const [state, formAction, isPending] = useActionState(deletePostAction, null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // 6 saniyə təsdiqlənməzsə rəvan şəkildə ilkin vəziyyətə qayıdır.
  // Göndərmə davam edərkən (isPending) sayğacı işə salmırıq ki, düymə
  // sorğu bitməmiş "Təsdiq"-dən "Sil"-ə tullanmasın.
  useEffect(() => {
    if (armed && !isPending) {
      timeoutRef.current = setTimeout(() => {
        setArmed(false);
      }, 6000);
    }
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [armed, isPending]);

  const handleCancel = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setArmed(false);
  };

  return (
    <div className="flex flex-col gap-1 items-end">
      <form action={formAction} className="inline-flex items-center">
        <input type="hidden" name="postId" value={postId} />
        {redirectTo && (
          <input type="hidden" name="redirectTo" value={redirectTo} />
        )}

        {/* Əsas Silmə / Təsdiq Düyməsi */}
        <button
          type="submit"
          disabled={isPending}
          aria-label={
            isPending
              ? "Məqalə silinir"
              : armed
                ? "Silinməni təsdiqləyin"
                : "Məqaləni sil"
          }
          onClick={(e) => {
            if (!armed) {
              e.preventDefault();
              setArmed(true);
            }
          }}
          className={`relative inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transform-gpu transition-all duration-200 ease-out cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed ${
            armed
              ? "bg-rose-600 hover:bg-rose-700 text-white shadow-sm ring-1 ring-rose-600"
              : "text-rose-600 border border-rose-200/90 bg-white hover:bg-rose-50/80 hover:border-rose-300"
          }`}
        >
          {isPending ? (
            <>
              <span className="h-3.5 w-3.5 block animate-spin rounded-full border-2 border-white border-t-transparent" />
              <span>Silinir...</span>
            </>
          ) : (
            <>
              <svg
                className={`w-3.5 h-3.5 transform-gpu transition-transform duration-200 ease-out shrink-0 ${
                  armed ? "rotate-12 scale-110 text-white" : "text-rose-600"
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                />
              </svg>

              {/* Rəvan Vertikal Roll Mətn Kontrolleri (GPU Odometer).
                  Yalnız vizualdır — düymənin adı `aria-label` ilə verilir,
                  ona görə hər iki yazı ekran oxuyucudan gizlədilir. */}
              <span
                aria-hidden="true"
                className="relative inline-block overflow-hidden transition-[width] duration-200 ease-out text-left"
                style={{ width: armed ? "52px" : "22px", height: "16px" }}
              >
                {/* 1. Normal "Sil" yazısı */}
                <span
                  className={`absolute inset-0 flex items-center transform-gpu transition-all duration-200 ease-out whitespace-nowrap ${
                    armed
                      ? "-translate-y-full opacity-0 pointer-events-none"
                      : "translate-y-0 opacity-100"
                  }`}
                >
                  Sil
                </span>

                {/* 2. Armed "Təsdiq" yazısı */}
                <span
                  className={`absolute inset-0 flex items-center transform-gpu transition-all duration-200 ease-out whitespace-nowrap ${
                    armed
                      ? "translate-y-0 opacity-100"
                      : "translate-y-full opacity-0 pointer-events-none"
                  }`}
                >
                  Təsdiq
                </span>
              </span>
            </>
          )}
        </button>

        {/* Rəvan CSS Grid Akordeon İmtina Düyməsi (Zero-Reflow) */}
        <div
          className="grid transform-gpu transition-all duration-200 ease-out"
          style={{
            gridTemplateColumns: armed ? "1fr" : "0fr",
            opacity: armed ? 1 : 0,
            marginLeft: armed ? "6px" : "0px",
          }}
          aria-hidden={!armed}
        >
          <div className="overflow-hidden min-w-0">
            <button
              type="button"
              onClick={handleCancel}
              tabIndex={armed ? 0 : -1}
              disabled={isPending}
              className="px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 transition-colors whitespace-nowrap cursor-pointer"
            >
              İmtina
            </button>
          </div>
        </div>
      </form>

      {state?.error && (
        <p
          role="alert"
          className="text-[11px] text-rose-600 font-medium animate-fadeIn"
        >
          {state.error}
        </p>
      )}
    </div>
  );
}
