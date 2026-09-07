import type { Metadata } from "next";
import Link from "next/link";
import { getPosts } from "@/lib/posts";

export const metadata: Metadata = {
  title: "Mənim Bloqum",
  description: "Next.js və proqramlaşdırma haqqında qeydlər",
};

export default async function HomePage() {
  const posts = await getPosts();

  return (
    <div className="min-h-screen">
      {/* Üst Header / Navigasiya */}
      <header className="border-b border-slate-200/80 bg-white/70 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="font-semibold text-lg text-slate-800 hover:text-slate-900 transition-colors">
            Peyman's Blog
          </Link>
          <nav className="flex items-center gap-6 text-sm text-slate-500 font-medium">
            <Link href="/" className="text-slate-900">Yazılar</Link>
            <span className="text-slate-300">/</span>
            <span className="hover:text-slate-700 cursor-pointer transition-colors">Haqqımda</span>
          </nav>
        </div>
      </header>

      {/* Əsas Məzmun */}
      <main className="max-w-3xl mx-auto py-12 px-6">
        <section className="mb-10">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight sm:text-4xl">
            Məqalələr & Qeydlər
          </h1>
          <p className="mt-2 text-base text-slate-600">
            Next.js, Full-Stack inkişaf və gündəlik proqramlaşdırma təcrübələrim.
          </p>
        </section>

        {/* Yazılar Siyahısı */}
        <section className="space-y-4">
          {posts.map((post) => (
            <article
              key={post.slug}
              className="group relative p-6 rounded-xl bg-white border border-slate-200/70 shadow-[0_1px_3px_rgba(0,0,0,0.05)] hover:shadow-md hover:border-slate-300 transition-all duration-200"
            >
              <div className="flex items-center justify-between gap-4 mb-2">
                <h2 className="text-xl font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                  {post.title}
                </h2>
                {post.date && (
                  <time className="text-xs font-medium text-slate-400 shrink-0">
                    {post.date}
                  </time>
                )}
              </div>

              <p className="text-slate-600 text-sm leading-relaxed mb-4">
                {post.excerpt}
              </p>

              <div className="flex items-center text-xs font-medium text-blue-600 group-hover:text-blue-700">
                <span>Daha ətraflı oxu</span>
                <span className="ml-1 transition-transform group-hover:translate-x-1">→</span>
              </div>
            </article>
          ))}
        </section>
      </main>
    </div>
  );
}
