import Link from "next/link";
import React from "react";

export interface EmptyStateProps {
  /**
   * İkon və ya emoji (Məsələn: 🔍, ❤️, 📝 və ya SVG komponent)
   */
  icon?: React.ReactNode;
  /**
   * Əsas diqqətçəkən başlıq
   */
  title: string;
  /**
   * Ətraflı izahedici mətn və ya təlimat
   */
  description?: React.ReactNode;
  /**
   * İstəyə bağlı hərəkətə çağırış (Call to action) linki və ya düyməsi
   */
  action?: {
    label: string;
    href?: string;
    onClick?: () => void;
  };
  className?: string;
}

/**
 * Reusable UI Komponenti:
 * Axtarış tapılmadıqda, bəyənilən yazılar boş olduqda və ya
 * heç bir məlumat mövcud olmadıqda çağırılan universal Boş Vəziyyət (Empty State).
 */
export default function EmptyState({
  icon = "🔍",
  title,
  description,
  action,
  className = "",
}: EmptyStateProps) {
  return (
    <div
      className={`text-center py-16 bg-white rounded-3xl border border-dashed border-slate-300 p-8 ${className}`}
    >
      {icon && (
        <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto text-2xl mb-4">
          {icon}
        </div>
      )}

      <h3 className="text-lg font-bold text-slate-900">{title}</h3>

      {description && (
        <p className="text-sm text-slate-500 mt-2 max-w-md mx-auto leading-relaxed">
          {description}
        </p>
      )}

      {action && (
        <div className="mt-6">
          {action.href ? (
            <Link
              href={action.href}
              className="inline-flex items-center px-4 py-2 rounded-xl text-xs font-semibold bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
            >
              {action.label}
            </Link>
          ) : action.onClick ? (
            <button
              onClick={action.onClick}
              className="inline-flex items-center px-4 py-2 rounded-xl text-xs font-semibold bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
            >
              {action.label}
            </button>
          ) : null}
        </div>
      )}
    </div>
  );
}
