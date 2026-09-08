import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Platforma Haqqında | OffByOne",
  description:
    "Next.js 16, React 19 və Prisma ilə qurulmuş yüksək performanslı mühəndislik və İT məqalə platforması haqqında məlumat.",
};

export default function AboutPage() {
  const pillars = [
    {
      icon: (
        <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      title: "Yüksək Sürət və Performans",
      description:
        "React Server Components (RSC) sayəsində müştəri brauzerinə sıfır artıq JavaScript göndərilir. Bütün ağır əməliyyatlar serverdə icra olunaraq ilk yüklənmə sürəti (LCP) maksimuma çatdırılır.",
    },
    {
      icon: (
        <svg className="w-6 h-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      title: "Dərinləşdirilmiş Təhlükəsizlik (OWASP)",
      description:
        "Sistem Timing Attack qorunması, Open Redirect filtri, Zod ilə runtime sahə doğrulaması və çoxsəviyyəli sessiya ləğvi (Session Versioning) ilə kiber hücumlara qarşı tam zirehlənib.",
    },
    {
      icon: (
        <svg className="w-6 h-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
        </svg>
      ),
      title: "Serverless Verilənlər Bazası",
      description:
        "Neon PostgreSQL və Prisma 7 adapteri (@prisma/adapter-pg) vasitəsilə bağlantı hovuzu (connection pooling) tətbiq olunur. Bu, serverless mühitlərdə ani sorğu emalı və stabil miqyaslanma təmin edir.",
    },
    {
      icon: (
        <svg className="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      ),
      title: "Azərbaycan Əlifbasına Uyğun SEO",
      description:
        "Xüsusi alqoritm başlıqlardakı milli simvolları (ə, ö, ü, ç, ş, ğ, ı) avtomatik URL dostu formata çevirir və eyni başlıqlı yazılar üçün unikal slug təhlükəsizliyi təmin edir.",
    },
  ];

  const techStack = [
    { name: "Next.js 16", role: "App Router, Server Actions, RSC", category: "Core Framework" },
    { name: "React 19", role: "useActionState, Optimistic UI & Actions", category: "Frontend Engine" },
    { name: "TypeScript", role: "100% Strict Type Safety & DTO Layer", category: "Language" },
    { name: "Tailwind CSS v4", role: "Modern CSS-first Styling Engine", category: "Design System" },
    { name: "Prisma 7 ORM", role: "Type-safe Database Access & Migrations", category: "Database Toolkit" },
    { name: "Neon PostgreSQL", role: "Serverless Postgres with PgBouncer Pooling", category: "Cloud Database" },
    { name: "Zod Schema", role: "Strict Runtime & Form Data Validation", category: "Validation" },
    { name: "Jose & Bcrypt", role: "Stateless JWT, Secure Cookies & Password Hashing", category: "Security" },
  ];

  const architecturalHighlights = [
    {
      title: "Server Actions ilə API-siz Rabitə",
      desc: "Ənənəvi REST API route-ları (/api/...) yazmadan, birbaşa müasir RPC mexanizmi ilə server funksiyaları təhlükəsiz çağırılır.",
    },
    {
      title: "Avtomatik Keş və Revalidasiya",
      desc: "revalidatePath mexanizmi ilə məqalə paylaşıldığı anda bütün qlobal keşlər avtomatik yenilənir və istifadəçilərə ən təzə məlumat çatdırılır.",
    },
    {
      title: "Xətalara Qarşı Davamlı Formalar",
      desc: "İstifadəçi məqalə yazarkən hər hansı validasiya xətası baş versə belə, daxil edilmiş məlumatlar və kateqoriya seçimi yadda saxlanılır və sıfırlanmır.",
    },
    {
      title: "Sessiyaların Çevik İdarəsi",
      desc: "sessionVersion sistemi sayəsində istifadəçi şifrəsini dəyişdikdə və ya istədikdə digər bütün cihazlardakı aktiv sessiyaları bir saniyədə ləğv edə bilir.",
    },
  ];

  return (
    <main className="max-w-5xl mx-auto py-12 px-4 sm:px-6 lg:px-8 space-y-12">
      {/* 1. Hero Başlıq Bölməsi */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 text-white rounded-3xl p-8 sm:p-14 shadow-xl border border-slate-700/50">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-8 -ml-8 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-semibold mb-6">
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
            Müasir Veb Arxitekturası
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            OffByOne: Dərin Mühəndislik və Sistemlər Platforması
          </h1>
          <p className="mt-5 text-slate-300 text-base sm:text-lg leading-relaxed font-normal">
            Bu platforma ən müasir Full-Stack standartlarını, React 19 Server Components fəlsəfəsini,
            etibarlı verilənlər bazası arxitekturasını və ciddi kibertəhlükəsizlik qaydalarını vahid bir
            ekosistemdə birləşdirən peşəkar nümunədir.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/"
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold shadow-md transition-all inline-flex items-center gap-2"
            >
              <span>Məqalələri Oxu</span>
              <span>→</span>
            </Link>
            <Link
              href="/new-post"
              className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white border border-white/20 text-sm font-semibold transition-all"
            >
              Məqalə Dərc Et
            </Link>
          </div>
        </div>
      </section>

      {/* 2. Platformanın Əsas Sütunları */}
      <section>
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-xs font-bold uppercase tracking-widest text-blue-600">
            Niyə Bu Platforma?
          </h2>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2 tracking-tight">
            Layihənin Təməl Mühəndislik Prinsipləri
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {pillars.map((pillar, idx) => (
            <div
              key={idx}
              className="bg-white p-7 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md hover:border-blue-200 transition-all group"
            >
              <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                {pillar.icon}
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">{pillar.title}</h3>
              <p className="text-slate-600 text-sm leading-relaxed">{pillar.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Texnoloji Ekosistem (Tech Stack) */}
      <section className="bg-white p-8 sm:p-12 rounded-3xl border border-slate-200/80 shadow-sm">
        <div className="mb-8">
          <span className="text-xs font-bold uppercase tracking-widest text-blue-600">
            İnfrastruktur
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1 tracking-tight">
            İstifadə Edilən Texnologiya Qatı
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            Layihədə yalnız müasir, davamlı və sənaye standartı olan texnologiyalar tətbiq olunub.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {techStack.map((tech) => (
            <div
              key={tech.name}
              className="p-4 rounded-xl bg-slate-50/80 border border-slate-200/60 hover:bg-blue-50/40 hover:border-blue-200 transition-all"
            >
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 block">
                {tech.category}
              </span>
              <h3 className="font-extrabold text-slate-900 text-base mt-1">{tech.name}</h3>
              <p className="text-xs text-slate-500 mt-1.5 leading-snug">{tech.role}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Mühəndislik və Arxitektura Fərqləri */}
      <section className="bg-gradient-to-b from-slate-50 to-white p-8 sm:p-12 rounded-3xl border border-slate-200/80 shadow-sm">
        <div className="mb-8">
          <span className="text-xs font-bold uppercase tracking-widest text-indigo-600">
            Daxili Detallar
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1 tracking-tight">
            Arxitektur Üstünlüklər
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {architecturalHighlights.map((item, idx) => (
            <div key={idx} className="flex gap-4 items-start">
              <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                ✓
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-sm">{item.title}</h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Alt Naviqasiya */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-200">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors"
        >
          <span>←</span>
          <span>Bütün məqalələrə qayıt</span>
        </Link>
        <span className="text-xs text-slate-400 font-medium">
          OffByOne &bull; Mühəndislik və Sistemlər Jurnalı
        </span>
      </div>
    </main>
  );
}
