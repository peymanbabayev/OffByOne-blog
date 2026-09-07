import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Haqqımda | Peyman's Blog",
  description: "Peyman haqqında məlumat və təcrübələr",
};

/**
 * Server Component:
 * /about marşrutu üçün səhifə komponenti.
 * Navbar artıq RootLayout-da olduğu üçün burada təkrar çağırmağa ehtiyac yoxdur!
 */
export default function AboutPage() {
  const techStack = [
    { name: "Next.js 16", desc: "App Router, RSC, Server Actions", tag: "Framework" },
    { name: "TypeScript", desc: "Type-safe, Clean & Maintainable Code", tag: "Language" },
    { name: "PostgreSQL & Neon", desc: "Serverless Database & Connection Pooling", tag: "Database" },
    { name: "Prisma ORM", desc: "Modern Type-safe Database Toolkit", tag: "ORM" },
    { name: "Tailwind CSS v4", desc: "Modern Responsive Utility-First Styling", tag: "Styling" },
    { name: "Docker", desc: "Containerization & Consistent Environments", tag: "DevOps" },
  ];

  return (
    <main className="max-w-5xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <article className="bg-white p-8 sm:p-12 rounded-3xl border border-slate-200/80 shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 pb-8 border-b border-slate-100">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-500 text-white font-black text-2xl flex items-center justify-center shadow-md shrink-0">
            PB
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">Full-Stack Tərtibatçı</span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-1">
              Peyman Babayev
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Müasir veb texnologiyaları və arxitektura həvəskarı
            </p>
          </div>
        </div>

        <div className="mt-8 space-y-4 text-slate-600 text-base leading-relaxed max-w-3xl">
          <p>
            Salam! Mən Peyman. Bu bloqda Next.js, React, TypeScript və müasir Full-Stack 
            texnologiyaları haqqında öyrəndiklərimi, real layihə təcrübələrimi və qarşılaşdığım texniki həlləri bölüşürəm.
          </p>
          <p>
            Məqsədim təmiz kod prinsipləri, yüksək performanslı veb tətbiqlər və gələcəyə davamlı 
            arxitektura standartlarını dərindən mənimsəmək və bu bilikləri faydalı qeydlər halına gətirməkdir.
          </p>
        </div>

        {/* İstifadə olunan Texnologiyalar Bölməsi */}
        <div className="mt-12">
          <h2 className="text-xl font-bold text-slate-900 mb-6">
            Əsas Texnologiya Qatı (Tech Stack)
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {techStack.map((tech) => (
              <div
                key={tech.name}
                className="p-4 rounded-xl bg-slate-50/80 border border-slate-200/60 hover:border-blue-200 transition-colors"
              >
                <span className="text-[10px] font-semibold uppercase tracking-wider text-blue-600">
                  {tech.tag}
                </span>
                <h3 className="font-bold text-slate-900 text-sm mt-0.5">{tech.name}</h3>
                <p className="text-xs text-slate-500 mt-1">{tech.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-slate-100 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors"
          >
            <span>←</span>
            <span>Bütün məqalələrə qayıt</span>
          </Link>
        </div>
      </article>
    </main>
  );
}
