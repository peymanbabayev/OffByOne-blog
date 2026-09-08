"use client";

import { useActionState } from "react";
import Link from "next/link";
import { registerAction } from "@/actions/auth";
import FormInput from "@/components/ui/FormInput";
import SubmitButton from "@/components/ui/SubmitButton";
import { useFormErrors } from "@/hooks/useFormErrors";

export default function RegisterForm({ from = "/" }: { from?: string }) {
  const [state, formAction] = useActionState(registerAction, null);
  const { generalError, getFieldError, clearFieldError } = useFormErrors(state);

  const loginUrl =
    from && from !== "/"
      ? `/login?from=${encodeURIComponent(from)}`
      : "/login";

  return (
    <form action={formAction} noValidate className="space-y-4">
      <input type="hidden" name="from" value={from} />

      {/* Ümumi sistem xətası mesajı */}
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

      {/* Ad və Soyad */}
      <FormInput
        id="name"
        name="name"
        label="Ad və Soyad"
        type="text"
        autoComplete="name"
        placeholder="nümunə: Əli Məmmədov"
        error={getFieldError("name")}
        onChange={() => clearFieldError("name")}
      />

      {/* E-poçt */}
      <FormInput
        id="email"
        name="email"
        label="E-poçt ünvanı"
        type="email"
        autoComplete="email"
        placeholder="nümunə: ali@example.com"
        error={getFieldError("email")}
        onChange={() => clearFieldError("email")}
      />

      {/* Şifrə */}
      <FormInput
        id="password"
        name="password"
        label="Şifrə"
        type="password"
        autoComplete="new-password"
        placeholder="Ən azı 8 simvol, hərf və rəqəm"
        error={getFieldError("password")}
        onChange={() => clearFieldError("password")}
      />

      {/* Şifrə Təkrarı */}
      <FormInput
        id="confirmPassword"
        name="confirmPassword"
        label="Şifrənin təkrarı"
        type="password"
        autoComplete="new-password"
        placeholder="Şifrəni təkrar daxil edin"
        error={getFieldError("confirmPassword")}
        onChange={() => clearFieldError("confirmPassword")}
      />

      <div className="pt-2">
        <SubmitButton label="Qeydiyyatı tamamla" loadingLabel="Hesab yaradılır..." />
      </div>

      <div className="text-center pt-3 border-t border-slate-100 text-xs text-slate-500">
        Artıq hesabınız var?{" "}
        <Link
          href={loginUrl}
          className="font-semibold text-blue-600 hover:text-blue-700 transition-colors"
        >
          Daxil olun
        </Link>
      </div>
    </form>
  );
}
