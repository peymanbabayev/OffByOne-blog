import type { Metadata } from "next";
import { getPosts } from "@/lib/posts";
import PostCard from "@/components/PostCard";

export const metadata: Metadata = {
  title: "Mənim Bloqum",
  description: "Next.js və proqramlaşdırma haqqında qeydlər",
};

/**
 * Server Component:
 * Navbar artıq RootLayout tərəfindən idarə olunur.
 * Səhifə yalnız özünə aid məzmunu render edir.
 */
export default async function HomePage() {
  const posts = await getPosts();
  const featuredPost = posts[0];
  const remainingPosts = posts.slice(1);

  return (
    <main className="max-w-7xl mx-auto py-10 sm:py-14 px-4 sm:px-6 lg:px-8">
      {/* Hero Başlıq Bölməsi */}
      <section className="mb-12 text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-100 mb-4">
          <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
          Full-Stack & Sistem Arxitekturası
        </div>
        <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
          Məqalələr, Qeydlər və Təcrübələr
        </h1>
        <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
          Next.js App Router, Prisma, PostgreSQL və müasir proqramlaşdırma prinsipləri üzrə şəxsi bloqum.
        </p>

        {/* Statistik göstəricilər */}
        <div className="mt-6 flex items-center justify-center gap-6 text-xs sm:text-sm font-medium text-slate-500">
          <span className="flex items-center gap-1.5">
            <span className="font-bold text-slate-800">{posts.length}</span> Məqalə
          </span>
          <span className="text-slate-300">•</span>
          <span className="flex items-center gap-1.5">
            <span className="font-bold text-blue-600">Neon</span> PostgreSQL
          </span>
          <span className="text-slate-300">•</span>
          <span className="flex items-center gap-1.5">
            <span className="font-bold text-slate-800">Next.js 16</span> RSC
          </span>
        </div>
      </section>

      {/* Seçilmiş Əsas Məqalə (Featured Hero Card) */}
      {featuredPost && (
        <section className="mb-12">
          <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 rounded-3xl p-8 sm:p-12 text-white shadow-xl">
            <div className="relative z-10 max-w-3xl">
              <span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-500 text-white mb-4">
                ⭐ Seçilmiş Məqalə
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
                <a href={`/blog/${featuredPost.slug}`} className="hover:text-blue-300 transition-colors">
                  {featuredPost.title}
                </a>
              </h2>
              <p className="mt-4 text-sm sm:text-base text-slate-300 leading-relaxed">
                {featuredPost.excerpt}
              </p>
              <div className="mt-8 flex items-center gap-4">
                <a
                  href={`/blog/${featuredPost.slug}`}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold transition-colors shadow-sm"
                >
                  <span>Məqaləni oxu</span>
                  <span>→</span>
                </a>
                <time className="text-xs text-slate-400">
                  {new Date(featuredPost.createdAt).toLocaleDateString("az-AZ", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </time>
              </div>
            </div>

            {/* Dekorativ arxa plan vizual effekti */}
            <div className="absolute -right-16 -bottom-16 w-80 h-80 rounded-full bg-blue-500/10 blur-3xl pointer-events-none"></div>
          </div>
        </section>
      )}

      {/* Bütün Məqalələrin Geniş Grid Şəbəkəsi (3 Sütun) */}
      <section>
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            Son Yazılar ({remainingPosts.length})
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {remainingPosts.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      </section>
    </main>
  );
}
