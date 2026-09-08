import Link from "next/link";
import React from "react";

export interface EmptyStateProps {
  /** İstəyə bağlı ikon (SVG komponent). Verilməzsə ikon sahəsi göstərilmir. */
  icon?: React.ReactNode;
  /** Əsas diqqətçəkən başlıq. */
  title: string;
  /** Ətraflı izahedici mətn və ya təlimat. */
  description?: React.ReactNode;
  /** İstəyə bağlı hərəkətə çağırış (link və ya düymə). */
  action?: {
    label: string;
    href?: string;
    onClick?: () => void;
  };
  className?: string;
}

/**
 * Reusable UI Komponenti:
 * Axtarış nəticəsi tapılmadıqda, siyahı boş olduqda və ya heç bir məlumat mövcud
 * olmadıqda göstərilən universal Boş Vəziyyət (Empty State).
 */
export default function EmptyState({
  icon,
  title,
  description,
  action,
  className = "",
}: EmptyStateProps) {
  const actionClass =
    "inline-flex items-center rounded-lg bg-accent px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-accent-hover";

  return (
    <div
      className={`rounded-card border border-dashed border-slate-300 bg-white px-6 py-14 text-center ${className}`}
    >
      {icon && (
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400">
          {icon}
        </div>
      )}

      <h3 className="text-base font-semibold text-slate-900">{title}</h3>

      {description && (
        <p className="mx-auto mt-1.5 max-w-md text-sm leading-relaxed text-slate-500">
          {description}
        </p>
      )}

      {action && (
        <div className="mt-5">
          {action.href ? (
            <Link href={action.href} className={actionClass}>
              {action.label}
            </Link>
          ) : action.onClick ? (
            <button onClick={action.onClick} className={actionClass}>
              {action.label}
            </button>
          ) : null}
        </div>
      )}
    </div>
  );
}
