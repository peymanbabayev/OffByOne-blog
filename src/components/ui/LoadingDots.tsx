interface LoadingDotsProps {
  /**
   * İndikatorun altında göstərilən kiçik mətn (istəyə bağlı)
   */
  text?: string;
  className?: string;
}

/**
 * Reusable UI Komponenti:
 * 3 tullanan mavi nöqtəli müasir və zərif yüklənmə indikatoru.
 * Sonsuz scroll, forma göndərilməsi və ya inline yüklənmələr üçün təkrar istifadə edilə bilər.
 */
export default function LoadingDots({
  text = "Yüklənir...",
  className = "",
}: LoadingDotsProps) {
  return (
    <div className={`flex flex-col items-center justify-center gap-2 ${className}`}>
      {/* 3 ritmik tullanan nöqtə */}
      <div className="flex items-center gap-2">
        <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-bounce [animation-delay:-0.3s]"></span>
        <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-bounce [animation-delay:-0.15s]"></span>
        <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-bounce"></span>
      </div>

      {text && (
        <p className="text-xs font-medium text-slate-400">
          {text}
        </p>
      )}
    </div>
  );
}
