"use client";

import { useActionState } from "react";
import Link from "@/i18n/navigation";
import { loginAction } from "@/actions/auth";
import FormInput from "@/components/ui/FormInput";
import SubmitButton from "@/components/ui/SubmitButton";
import { useFormErrors } from "@/hooks/useFormErrors";
import { useDictionary, useLang } from "@/i18n/client";

export default function LoginForm({
  from = "/",
  onSwitchToRegister,
}: {
  from?: string;
  onSwitchToRegister?: () => void;
}) {
  const dict = useDictionary();
  const lang = useLang();
  const [state, formAction] = useActionState(loginAction, null);
  const { generalError, getFieldError, clearFieldError } = useFormErrors(state);

  const registerUrl =
    from && from !== "/"
      ? `/register?from=${encodeURIComponent(from)}`
      : "/register";

  return (
    <form action={formAction} noValidate className="space-y-5">
      <input type="hidden" name="from" value={from} />
      <input type="hidden" name="lang" value={lang} />
      {/* Ümumi Xəta Mesajı (Məs: E-poçt və ya şifrə yanlışdır) */}
      {generalError && (
        <div className="p-3.5 text-sm text-red-700 bg-red-50 border border-red-200/80 rounded-xl flex items-start gap-2.5 animate-fadeIn dark:border-red-900/50 dark:bg-red-950/20 dark:text-red-300">
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
        label={dict.auth.emailLabel}
        type="email"
        autoComplete="email"
        placeholder={dict.auth.emailPlaceholderLogin}
        error={getFieldError("email")}
        onChange={() => clearFieldError("email")}
      />

      {/* Şifrə */}
      <FormInput
        id="password"
        name="password"
        label={dict.auth.passwordLabel}
        type="password"
        autoComplete="current-password"
        placeholder={dict.auth.passwordPlaceholderLogin}
        error={getFieldError("password")}
        onChange={() => clearFieldError("password")}
      />

      <div className="pt-2">
        <SubmitButton label={dict.auth.loginButton} loadingLabel={dict.auth.loginLoading} />
      </div>

      <div className="text-center pt-3 border-t border-slate-100 text-xs text-slate-500 dark:border-slate-800 dark:text-slate-400">
        {dict.auth.noAccount}{" "}
        <Link
          href={registerUrl}
          onClick={(e) => {
            if (onSwitchToRegister && !e.metaKey && !e.ctrlKey) {
              e.preventDefault();
              onSwitchToRegister();
            }
          }}
          className="font-semibold text-accent hover:text-accent-hover transition-colors"
        >
          {dict.auth.switchToRegister}
        </Link>
      </div>
    </form>
  );
}
