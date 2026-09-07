import Link from "next/link";
import { BLOG_CONFIG } from "@/constants/blog";

/**
 * Nested Layout (Bloq üçün ortaq layout):
 * Bu layout yalnız /blog və onun bütün alt marşrutlarına (/blog/[slug]) şamil edilir.
 * Əsas RootLayout-un (Navbar daxil olmaqla) daxilində render olunur.
 */
export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { author, popularTags } = BLOG_CONFIG;

  return (
    <div className="max-w-7xl mx-auto py-10 sm:py-14 px-4 sm:px-6 lg:px-8">
      {/* 2 Sütunlu Grid Layout: Sol tərəf məzmun (col-span-8), sağ tərəf sidebar (col-span-4) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        
        {/* Əsas Oxuma Sahəsi */}
        <main className="lg:col-span-8">
          {children}
        </main>

        {/* Bloqa Xüsusi Sağ Sidebar */}
        <aside className="lg:col-span-4 space-y-6">
          
          {/* 1. Müəllif Qutusu */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 font-bold flex items-center justify-center text-sm">
                {author.avatarInitials}
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 text-sm">{author.name}</h3>
                <p className="text-xs text-slate-500">{author.role}</p>
              </div>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              {author.bio}
            </p>
            <div className="mt-4 pt-3 border-t border-slate-100">
              <Link 
                href="/about" 
                className="text-xs font-medium text-blue-600 hover:text-blue-700 transition-colors"
              >
                Haqqımda ətraflı oxu →
              </Link>
            </div>
          </div>

          {/* 2. Populyar Teqlər / Kateqoriyalar */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
            <h3 className="font-semibold text-slate-900 text-sm mb-3">
              Mövzular
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {popularTags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs px-2.5 py-1 rounded-md bg-slate-100 text-slate-600 hover:bg-slate-200 cursor-pointer transition-colors"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* 3. Bildiriş Qutusu */}
          <div className="p-5 rounded-2xl bg-blue-50/50 border border-blue-100 text-slate-700">
            <h4 className="text-xs font-bold uppercase tracking-wider text-blue-800 mb-1">
              İpucu 💡
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Bu sidebar yalnız <code>/blog/*</code> səhifələrində görünür. Əsas səhifə və Haqqımda bölməsi isə öz sadə quruluşunda qalır.
            </p>
          </div>

        </aside>
      </div>
    </div>
  );
}
