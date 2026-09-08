interface BrandLoadingProps {
  /**
   * Göstəriləcək izah mətni (Default: "Məlumatlar hazırlanır...")
   */
  message?: string;
  /**
   * Tam ekran və ya kompakt bölmə rejimində olması
   */
  fullScreen?: boolean;
  className?: string;
}

export default function BrandLoading({
  message = "Səhifə hazırlanır...",
  fullScreen = true,
  className = "",
}: BrandLoadingProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center p-8 text-center animate-fadeIn ${
        fullScreen ? "min-h-[calc(100vh-14rem)]" : "py-12"
      } ${className}`}
      role="status"
      aria-live="polite"
    >
      {/* Ən yuxarıdakı ultra-incə axıcı progress xətti */}
      <div
        className="fixed top-0 left-0 right-0 z-50 h-0.5 bg-gradient-to-r from-accent via-sky-400 to-indigo-500 animate-pulse"
        aria-hidden="true"
      />

      <div className="relative flex flex-col items-center">
        {/* Loqo arxasındakı ambient parlaqlıq (Breathing Glow) */}
        <div
          className="absolute -inset-4 bg-gradient-to-tr from-blue-600/20 via-sky-400/20 to-indigo-600/10 rounded-3xl blur-2xl animate-pulse pointer-events-none"
          aria-hidden="true"
        />

        {/* Canlı Animasiyalı OffByOne Vektor Loqosu */}
        <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-950 p-2.5 shadow-xl shadow-slate-900/10 ring-1 ring-slate-800/90 transition-transform">
          <svg
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="h-full w-full"
            aria-hidden="true"
          >
            <defs>
              <linearGradient
                id="loading-glow"
                x1="16"
                y1="6"
                x2="22"
                y2="20"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#38bdf8" />
                <stop offset="1" stopColor="#2563eb" />
              </linearGradient>
            </defs>

            {/* Sütun 1: Baza Sistem Slaş-ı (Ritmik nəbz) */}
            <line
              x1="10.5"
              y1="23"
              x2="15.5"
              y2="9"
              stroke="#FFFFFF"
              strokeWidth="3.2"
              strokeLinecap="round"
              className="animate-pulse"
            />

            {/* Sütun 2: +1 Sürüşməsi (Offset Qatı) - Dinamik yanıb-sönmə */}
            <line
              x1="16.5"
              y1="20"
              x2="21.5"
              y2="6"
              stroke="url(#loading-glow)"
              strokeWidth="3.2"
              strokeLinecap="round"
              className="animate-pulse [animation-delay:200ms]"
            />

            {/* Canlı Nəbz Nöqtəsi (Heartbeat) */}
            <circle
              cx="21"
              cy="22"
              r="1.75"
              fill="#38bdf8"
              className="animate-ping [animation-duration:1.5s]"
            />
            <circle cx="21" cy="22" r="1.75" fill="#38bdf8" />
          </svg>
        </div>

        {/* Brend Mətni */}
        <div className="mt-5 flex items-center gap-1 text-lg font-black tracking-tight text-slate-900">
          <span>OffBy</span>
          <span className="text-accent">One</span>
          <span className="text-xs font-mono text-slate-400 ml-0.5">.dev</span>
        </div>

        {/* Dinamik İzah və İndikator nöqtələri */}
        <div className="mt-2.5 flex items-center gap-2 text-xs font-medium text-slate-500">
          <span>{message}</span>
          <span className="flex gap-1" aria-hidden="true">
            <span className="h-1.5 w-1.5 rounded-full bg-accent animate-bounce [animation-delay:-0.3s]" />
            <span className="h-1.5 w-1.5 rounded-full bg-accent animate-bounce [animation-delay:-0.15s]" />
            <span className="h-1.5 w-1.5 rounded-full bg-accent animate-bounce" />
          </span>
        </div>
      </div>
    </div>
  );
}
