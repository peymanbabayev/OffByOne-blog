"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import {
  signOutOtherDevicesAction,
  type SecurityActionState,
} from "@/actions/auth";
import { useDictionary, useLang } from "@/i18n/client";

/**
 * Client Component — "Bütün digər cihazlardan çıxış" üçün iki-addımlı inline
 * təsdiq (DeletePostButton pattern-inin sadə variantı). `window.confirm` YOX.
 * Uğurlu olduqda cari sessiya açıq qalır — action cookie-ni yeni `sv` ilə yenidən verir.
 */
export default function SignOutOtherDevicesButton() {
  const dict = useDictionary();
  const lang = useLang();
  const [armed, setArmed] = useState(false);
  const [result, setResult] = useState<SecurityActionState | null>(null);
  const [isPending, startTransition] = useTransition();
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // 6 saniyə təsdiqlənməzsə ilkin vəziyyətə qayıdır.
  useEffect(() => {
    if (!armed) return;
    timeoutRef.current = setTimeout(() => setArmed(false), 6000);
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [armed]);

  const handleCancel = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setArmed(false);
  };

  const handleClick = () => {
    if (!armed) {
      setResult(null);
      setArmed(true);
      return;
    }
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    startTransition(async () => {
      const res = await signOutOtherDevicesAction(lang);
      setResult(res);
      setArmed(false);
    });
  };

  return (
    <div className="flex flex-col items-start gap-1.5">
      <div className="inline-flex items-center gap-2">
        <button
          type="button"
          onClick={handleClick}
          disabled={isPending}
          aria-label={
            isPending
              ? dict.signOutOthers.ariaLoading
              : armed
                ? dict.signOutOthers.ariaArmed
                : dict.signOutOthers.ariaDefault
          }
          className={`inline-flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-semibold transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-60 ${
            armed
              ? "bg-rose-600 text-white shadow-sm ring-1 ring-rose-600 hover:bg-rose-700"
              : "border border-rose-200/90 bg-white text-rose-600 hover:border-rose-300 hover:bg-rose-50/80 dark:border-rose-900/60 dark:bg-slate-900 dark:hover:bg-rose-950/40"
          }`}
        >
          {isPending
            ? dict.signOutOthers.loading
            : armed
              ? dict.signOutOthers.confirm
              : dict.signOutOthers.button}
        </button>

        {armed && !isPending && (
          <button
            type="button"
            onClick={handleCancel}
            className="rounded-lg bg-slate-100 px-2.5 py-2 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-200 hover:text-slate-900 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-slate-50"
          >
            {dict.signOutOthers.cancel}
          </button>
        )}
      </div>

      {result?.error && (
        <p role="alert" className="animate-fadeIn text-[11px] font-medium text-rose-600 dark:text-rose-400">
          {result.error}
        </p>
      )}
      {result?.success && (
        <p role="status" className="animate-fadeIn text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
          {dict.authActions.signOutOthersSuccess}
        </p>
      )}
    </div>
  );
}
