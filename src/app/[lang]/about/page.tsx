import type { Metadata } from "next";
import Link from "@/i18n/navigation";
import { getDictionary, getDictionaryFor } from "@/i18n/dictionaries";
import { isLocale, defaultLocale } from "@/i18n/config";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const dict = getDictionaryFor(isLocale(lang) ? lang : defaultLocale);
  return {
    title: dict.meta.aboutTitle,
    description: dict.meta.aboutDescription,
  };
}

const PILLAR_ICONS = [
  <svg key="0" className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>,
  <svg key="1" className="w-6 h-6 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>,
  <svg key="2" className="w-6 h-6 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
  </svg>,
  <svg key="3" className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
  </svg>,
];

export default async function AboutPage() {
  const dict = await getDictionary();
  const pillars = dict.about.pillars.map((p, idx) => ({ ...p, icon: PILLAR_ICONS[idx] }));

  return (
    <main className="max-w-5xl mx-auto py-12 px-4 sm:px-6 lg:px-8 space-y-12">
      {/* 1. Hero Başlıq Bölməsi */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 text-white rounded-3xl p-8 sm:p-14 shadow-xl border border-slate-700/50">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-8 -ml-8 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-semibold mb-6">
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
            {dict.about.heroTag}
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            {dict.about.heroTitle}
          </h1>
          <p className="mt-5 text-slate-300 text-base sm:text-lg leading-relaxed font-normal">
            {dict.about.heroDesc}
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/"
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold shadow-md transition-all inline-flex items-center gap-2"
            >
              <span>{dict.about.readPosts}</span>
              <span>→</span>
            </Link>
            <Link
              href="/new-post"
              className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white border border-white/20 text-sm font-semibold transition-all"
            >
              {dict.about.publishPost}
            </Link>
          </div>
        </div>
      </section>

      {/* 2. Platformanın Əsas Sütunları */}
      <section>
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-xs font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400">
            {dict.about.whyLabel}
          </h2>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2 tracking-tight dark:text-slate-50">
            {dict.about.whyTitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {pillars.map((pillar, idx) => (
            <div
              key={idx}
              className="bg-white p-7 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md hover:border-blue-200 transition-all group dark:border-slate-800 dark:bg-slate-900 dark:shadow-none dark:hover:border-blue-500/30"
            >
              <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform dark:border-slate-800 dark:bg-slate-800/60">
                {pillar.icon}
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2 dark:text-slate-50">{pillar.title}</h3>
              <p className="text-slate-600 text-sm leading-relaxed dark:text-slate-400">{pillar.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Texnoloji Ekosistem (Tech Stack) */}
      <section className="bg-white p-8 sm:p-12 rounded-3xl border border-slate-200/80 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:shadow-none">
        <div className="mb-8">
          <span className="text-xs font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400">
            {dict.about.infraLabel}
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1 tracking-tight dark:text-slate-50">
            {dict.about.techTitle}
          </h2>
          <p className="text-slate-500 text-sm mt-1 dark:text-slate-400">
            {dict.about.techDesc}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {dict.about.tech.map((tech) => (
            <div
              key={tech.name}
              className="p-4 rounded-xl bg-slate-50/80 border border-slate-200/60 hover:bg-blue-50/40 hover:border-blue-200 transition-all dark:border-slate-800 dark:bg-slate-800/40 dark:hover:bg-blue-500/10 dark:hover:border-blue-500/30"
            >
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 block dark:text-blue-400">
                {tech.category}
              </span>
              <h3 className="font-extrabold text-slate-900 text-base mt-1 dark:text-slate-50">{tech.name}</h3>
              <p className="text-xs text-slate-500 mt-1.5 leading-snug dark:text-slate-400">{tech.role}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Mühəndislik və Arxitektura Fərqləri */}
      <section className="bg-gradient-to-b from-slate-50 to-white p-8 sm:p-12 rounded-3xl border border-slate-200/80 shadow-sm dark:border-slate-800 dark:from-slate-900 dark:to-slate-900/60 dark:shadow-none">
        <div className="mb-8">
          <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
            {dict.about.detailsLabel}
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1 tracking-tight dark:text-slate-50">
            {dict.about.archTitle}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {dict.about.highlights.map((item, idx) => (
            <div key={idx} className="flex gap-4 items-start">
              <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 dark:bg-blue-500/15 dark:text-blue-400">
                ✓
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-sm dark:text-slate-50">{item.title}</h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed dark:text-slate-400">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Alt Naviqasiya */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-800">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors dark:text-blue-400 dark:hover:text-blue-300"
        >
          <span>←</span>
          <span>{dict.about.backToAll}</span>
        </Link>
        <span className="text-xs text-slate-400 font-medium dark:text-slate-500">
          OffByOne &bull; {dict.about.journalTag}
        </span>
      </div>
    </main>
  );
}
