import React from "react";

export interface FormInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  id: string;
}

/**
 * Təkrar istifadə oluna bilən, Əlçatanlıq (a11y - WCAG) standartlarına uyğun FormInput komponenti.
 * 
 * - Standart <input> atributlarını (placeholder, type, onChange və s.) birbaşa qəbul edir.
 * - Xəta vəziyyətində 'aria-invalid' və 'aria-describedby' atributları ilə ekran oxuyucularını məlumatlandırır.
 * - Stilləri mərkəzləşdirir (DRY prinsipi).
 */
export default function FormInput({
  label,
  error,
  id,
  className = "",
  ...props
}: FormInputProps) {
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

      {/* Input */}
      <input
        id={id}
        aria-invalid={!!error}
        aria-describedby={error ? errorId : undefined}
        className={`w-full px-4 py-2.5 rounded-xl border text-sm transition-all shadow-sm focus:outline-none focus:ring-2 ${
          error
            ? "border-red-300 bg-red-50/30 text-red-900 focus:border-red-500 focus:ring-red-500/20"
            : "border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:ring-blue-500/20"
        } ${className}`}
        {...props}
      />

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
