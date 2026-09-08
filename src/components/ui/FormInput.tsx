"use client";

import React, { useState } from "react";

export interface FormInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  id: string;
  allowPasswordToggle?: boolean;
}

/**
 * Təkrar istifadə oluna bilən, Əlçatanlıq (a11y - WCAG) standartlarına uyğun FormInput komponenti.
 * 
 * - Standart <input> atributlarını (placeholder, type, onChange və s.) birbaşa qəbul edir.
 * - Xəta vəziyyətində 'aria-invalid' və 'aria-describedby' atributları ilə ekran oxuyucularını məlumatlandırır.
 * - Şifrə xanalarında istifadəçi üçün rahat "Göstər / Gizlət" düyməsini dəstəkləyir.
 * - Stilləri mərkəzləşdirir (DRY prinsipi).
 */
export default function FormInput({
  label,
  error,
  id,
  type,
  className = "",
  allowPasswordToggle = true,
  ...props
}: FormInputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";
  const actualType = isPassword && allowPasswordToggle && showPassword ? "text" : type;
  const errorId = `${id}-error`;

  return (
    <div className="w-full">
      {/* Label */}
      <label
        htmlFor={id}
        className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5"
      >
        {label}
      </label>

      {/* Input container */}
      <div className="relative">
        <input
          id={id}
          type={actualType}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : undefined}
          className={`w-full px-4 py-2.5 rounded-xl border text-sm transition-all shadow-sm focus:outline-none focus:ring-2 ${
            isPassword && allowPasswordToggle ? "pr-11" : ""
          } ${
            error
              ? "border-red-300 bg-red-50/30 text-red-900 focus:border-red-500 focus:ring-red-500/20"
              : "border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:ring-blue-500/20"
          } ${className}`}
          {...props}
        />

        {isPassword && allowPasswordToggle && (
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            tabIndex={-1}
            aria-label={showPassword ? "Şifrəni gizlət" : "Şifrəni göstər"}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none p-1 rounded-md transition-colors"
          >
            {showPassword ? (
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 01-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
                />
              </svg>
            ) : (
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            )}
          </button>
        )}
      </div>

      {/* Xəta Mətni */}
      {error && (
        <p
          id={errorId}
          role="alert"
          className="mt-1.5 text-xs text-red-600 font-medium flex items-center gap-1 animate-fadeIn"
        >
          <svg
            className="w-3.5 h-3.5 shrink-0 text-red-500"
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
          <span>{error}</span>
        </p>
      )}
    </div>
  );
}
