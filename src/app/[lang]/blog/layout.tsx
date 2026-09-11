import Link from "@/i18n/navigation";
import ReadingProgressBar from "@/components/ui/ReadingProgressBar";
import { getDictionary } from "@/i18n/dictionaries";

export default async function BlogRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const dict = await getDictionary();

  return (
    <div className="min-h-screen">
      {/* 1. Məqalə oxunarkən ekranın ən üstündə hərəkət edən proqres xətti */}
      <ReadingProgressBar />

      {/* 2. Zərif Üst Naviqasiya Paneli (Breadcrumb) */}
      <div className="bg-slate-50/80 border-b border-slate-200/70 dark:border-slate-800/70 dark:bg-slate-900/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
            <Link
              href="/"
              className="hover:text-blue-600 transition-colors flex items-center gap-1 dark:hover:text-blue-400"
            >
              <span>🏠</span>
              <span>{dict.blogChrome.home}</span>
            </Link>
            <span className="text-slate-300 dark:text-slate-700">/</span>
            <Link
              href="/"
              className="hover:text-blue-600 transition-colors dark:hover:text-blue-400"
            >
              {dict.blogChrome.posts}
            </Link>
            <span className="text-slate-300 dark:text-slate-700">/</span>
            <span className="text-slate-700 font-semibold truncate max-w-[200px] sm:max-w-md dark:text-slate-300">
              {dict.blogChrome.reading}
            </span>
          </nav>
        </div>
      </div>

      {/* 3. Bloq Məzmunu */}
      {children}
    </div>
  );
}
