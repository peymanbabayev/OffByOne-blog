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
  return (
    <main className="max-w-3xl mx-auto py-12 px-6">
      <article className="bg-white p-8 sm:p-10 rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
          Haqqımda
        </h1>

        <div className="space-y-4 text-slate-600 leading-relaxed">
          <p>
            Salam! Mən Peyman. Bu bloqda Next.js, React, TypeScript və müasir Full-Stack 
            texnologiyaları haqqında öyrəndiklərimi və təcrübələrimi bölüşürəm.
          </p>
          <p>
            Məqsədim təmiz kod, performanslı veb tətbiqlər və müasir arxitektura 
            prinsiplərini dərindən mənimsəmək və tətbiq etməkdir.
          </p>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-100 flex gap-4">
          <Link
            href="/"
            className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
          >
            ← Yazılara qayıt
          </Link>
        </div>
      </article>
    </main>
  );
}
