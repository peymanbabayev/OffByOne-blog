"use client";

import { useActionState } from "react";
import Link from "next/link";
import { loginAction } from "@/actions/auth";
import FormInput from "@/components/ui/FormInput";
import SubmitButton from "@/components/ui/SubmitButton";
import { useFormErrors } from "@/hooks/useFormErrors";

export default function LoginForm({ from = "/" }: { from?: string }) {
  const [state, formAction] = useActionState(loginAction, null);
  const { generalError, getFieldError, clearFieldError } = useFormErrors(state);

  return (
    <form action={formAction} noValidate className="space-y-5">
      <input type="hidden" name="from" value={from} />
      {/* Ümumi Xəta Mesajı (Məs: E-poçt və ya şifrə yanlışdır) */}
      {generalError && (
        <div className="p-3.5 text-sm text-red-700 bg-red-50 border border-red-200/80 rounded-xl flex items-start gap-2.5 animate-fadeIn">
          <svg
            className="w-5 h-5 text-red-500 shrink-0 mt-0.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>{generalError}</span>
        </div>
      )}

      {/* E-poçt */}
      <FormInput
        id="email"
        name="email"
        label="E-poçt ünvanı"
        type="email"
        autoComplete="email"
        placeholder="nümunə: peyman@example.com"
        error={getFieldError("email")}
        onChange={() => clearFieldError("email")}
      />

      {/* Şifrə */}
      <FormInput
        id="password"
        name="password"
        label="Şifrə"
        type="password"
        autoComplete="current-password"
        placeholder="••••••••"
        error={getFieldError("password")}
        onChange={() => clearFieldError("password")}
      />

      <div className="pt-2">
        <SubmitButton label="Daxil ol" loadingLabel="Giriş edilir..." />
      </div>

      <div className="text-center pt-3 border-t border-slate-100 text-xs text-slate-500">
        Hesabınız yoxdur?{" "}
        <Link
          href="/register"
          className="font-semibold text-blue-600 hover:text-blue-700 transition-colors"
        >
          Qeydiyyatdan keçin
        </Link>
      </div>
    </form>
  );
}
