"use client";

import { useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { logoutAction, logoutEverywhereAction } from "@/actions/auth";

interface UserMenuProps {
  user: { name: string; email: string; role: "USER" | "ADMIN" };
}

/**
 * Client Component — navbar-dakı istifadəçi menyusu.
 * Gündəlik "çıxış" və nadir/destruktiv "bütün cihazlardan çıxış" burada ayrılır
 * (əvvəllər ikisi yan-yana idi). Menyu Esc və kənara klik ilə bağlanır.
 */
export default function UserMenu({ user }: UserMenuProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const menuId = useId();

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={menuId}
        className="flex items-center gap-2 rounded-lg py-1 pl-1 pr-2 transition-colors hover:bg-slate-100"
      >
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-xs font-semibold text-white">
          {user.name.charAt(0).toUpperCase()}
        </span>
        <span className="hidden text-sm font-medium text-slate-700 sm:block">
          {user.name.split(" ")[0]}
        </span>
        <svg
          className={`hidden h-3.5 w-3.5 text-slate-400 transition-transform sm:block ${
            open ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {open && (
        <div
          id={menuId}
          role="menu"
          className="absolute right-0 z-40 mt-2 w-60 overflow-hidden rounded-card border border-slate-200 bg-white shadow-lg"
        >
          <div className="border-b border-slate-100 px-4 py-3">
            <p className="flex items-center gap-2 text-sm font-semibold text-slate-900">
              <span className="truncate">{user.name}</span>
              {user.role === "ADMIN" && (
                <span className="shrink-0 rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-bold text-amber-800">
                  ADMIN
                </span>
              )}
            </p>
            <p className="mt-0.5 truncate text-xs text-slate-400">{user.email}</p>
          </div>

          <div className="p-1.5">
            <Link
              href="/new-post"
              role="menuitem"
              onClick={() => setOpen(false)}
              className="block rounded-md px-3 py-2 text-sm text-slate-700 transition-colors hover:bg-slate-50"
            >
              Yeni məqalə
            </Link>
          </div>

          <div className="border-t border-slate-100 p-1.5">
            <form action={logoutAction}>
              <button
                type="submit"
                role="menuitem"
                className="w-full rounded-md px-3 py-2 text-left text-sm text-slate-700 transition-colors hover:bg-slate-50"
              >
                Bu cihazdan çıx
              </button>
            </form>
            <form
              action={logoutEverywhereAction}
              onSubmit={(e) => {
                if (
                  !window.confirm(
                    "Bütün cihazlardakı aktiv sessiyalar bağlanacaq. Davam edilsin?"
                  )
                ) {
                  e.preventDefault();
                }
              }}
            >
              <button
                type="submit"
                role="menuitem"
                className="w-full rounded-md px-3 py-2 text-left text-sm text-rose-600 transition-colors hover:bg-rose-50"
              >
                Bütün cihazlardan çıx
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
