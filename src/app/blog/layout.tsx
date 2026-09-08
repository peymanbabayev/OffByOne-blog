import Link from "next/link";
import ReadingProgressBar from "@/components/ui/ReadingProgressBar";

export default function BlogRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
      {/* 1. Məqalə oxunarkən ekranın ən üstündə hərəkət edən proqres xətti */}
      <ReadingProgressBar />

      {/* 2. Zərif Üst Naviqasiya Paneli (Breadcrumb) */}
      <div className="bg-slate-50/80 border-b border-slate-200/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-medium text-slate-500">
            <Link
              href="/"
              className="hover:text-blue-600 transition-colors flex items-center gap-1"
            >
              <span>🏠</span>
              <span>Ana Səhifə</span>
            </Link>
            <span className="text-slate-300">/</span>
            <Link
              href="/"
              className="hover:text-blue-600 transition-colors"
            >
              Bloq Yazıları
            </Link>
            <span className="text-slate-300">/</span>
            <span className="text-slate-700 font-semibold truncate max-w-[200px] sm:max-w-md">
              Mütaliə
            </span>
          </nav>
        </div>
      </div>

      {/* 3. Bloq Məzmunu */}
      {children}
    </div>
  );
}

