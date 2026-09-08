import Link from "next/link";

interface BrandLogoProps {
  /**
   * İkonun ölçüsü:
   * "sm" - 28px (Footer və kompakt yerlər üçün)
   * "md" - 34px (Navbar üçün əsas standart)
   * "lg" - 42px (Auth və Hero üçün böyük format)
   */
  size?: "sm" | "md" | "lg";
  /**
   * Brend mətninin göstərilib-göstərilməməsi
   */
  showText?: boolean;
  /**
   * Brend adı: Default "OffByOne"
   */
  brandName?: string;
  /**
   * Domen / Tag sonluğu: Default ".dev"
   */
  domainSuffix?: string;
  /**
   * Link kimi işləməsi üçün href, null olarsa yalnız div qaytarır
   */
  href?: string | null;
  className?: string;
}

export default function BrandLogo({
  size = "md",
  showText = true,
  brandName = "OffByOne",
  domainSuffix = ".dev",
  href = "/",
  className = "",
}: BrandLogoProps) {
  const containerSizes = {
    sm: "h-7 w-7 rounded-lg",
    md: "h-8.5 w-8.5 rounded-xl",
    lg: "h-11 w-11 rounded-2xl",
  };

  const textSizes = {
    sm: "text-base tracking-tight",
    md: "text-lg tracking-tight",
    lg: "text-2xl tracking-tight",
  };

  const logoVisual = (
    <div className={`inline-flex items-center gap-2.5 font-bold text-slate-900 group ${className}`}>
      {/* Vektor Həndəsi OffByOne İkonu — Dinamik Offset Slaşları (// + 1 Offset) */}
      <div
        className={`relative flex shrink-0 items-center justify-center bg-slate-950 shadow-sm ring-1 ring-slate-800/90 transition-all duration-200 group-hover:scale-105 group-hover:shadow-md group-hover:ring-accent/50 group-hover:bg-black ${containerSizes[size]}`}
      >
        <svg
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="h-full w-full p-1"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="offbyone-glow" x1="16" y1="6" x2="22" y2="20" gradientUnits="userSpaceOnUse">
              <stop stopColor="#38bdf8" />
              <stop offset="1" stopColor="#2563eb" />
            </linearGradient>
          </defs>

          {/* Sütun 1: Baza Sistem Slaş-ı — Təmiz ağ, stabil karkas */}
          <line
            x1="10.5"
            y1="23"
            x2="15.5"
            y2="9"
            stroke="#FFFFFF"
            strokeWidth="3.2"
            strokeLinecap="round"
          />

          {/* Sütun 2: +1 Sürüşməsi (Offset) — 1 addım sağa və yuxarı yüksəlmiş reaktiv qat */}
          <line
            x1="16.5"
            y1="20"
            x2="21.5"
            y2="6"
            stroke="url(#offbyone-glow)"
            strokeWidth="3.2"
            strokeLinecap="round"
          />

          {/* Canlı Nəbz / Offset Balans Nöqtəsi */}
          <circle cx="21" cy="22" r="1.75" fill="#38bdf8" />
        </svg>
      </div>

      {showText && (
        <span className={`font-black transition-colors ${textSizes[size]}`}>
          {brandName === "OffByOne" ? (
            <>
              <span className="text-slate-900 group-hover:text-black">OffBy</span>
              <span className="text-accent group-hover:text-accent-hover">One</span>
            </>
          ) : (
            <span className="text-slate-900 group-hover:text-black">{brandName}</span>
          )}
          <span className="font-medium text-slate-400 text-xs sm:text-sm ml-0.5 group-hover:text-slate-600 transition-colors">
            {domainSuffix}
          </span>
        </span>
      )}
    </div>
  );

  if (href) {
    return (
      <Link
        href={href}
        className="inline-flex items-center rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
      >
        {logoVisual}
      </Link>
    );
  }

  return logoVisual;
}
