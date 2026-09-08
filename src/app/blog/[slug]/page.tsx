import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { getPostBySlug } from "@/lib/posts";

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return {
      title: "Yazı tapılmadı",
    };
  }

  return {
    title: `${post.title} | Mənim Bloqum`,
    description: post.excerpt,
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const formattedDate = new Date(post.createdAt).toLocaleDateString("az-AZ", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <article className="bg-white p-8 sm:p-10 rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
      {/* Müəllif və Tarix Məlumatı */}
      <div className="flex items-center justify-between gap-4 border-b border-slate-100 pb-5 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-500 text-white flex items-center justify-center font-bold text-sm shadow-sm">
            {post.author?.name ? post.author.name.charAt(0).toUpperCase() : "P"}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-slate-900">
                {post.author?.name || "Peyman Babayev"}
              </span>
              {post.author?.role === "ADMIN" ? (
                <span className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 font-bold text-[10px]">
                  ADMIN
                </span>
              ) : (
                <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-medium text-[10px]">
                  Müəllif
                </span>
              )}
            </div>
            <span className="text-xs text-slate-400">
              {post.author?.email || "peyman@example.com"}
            </span>
          </div>
        </div>

        <time className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          {formattedDate}
        </time>
      </div>

      <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-2 mb-4 leading-tight">
        {post.title}
      </h1>

      <p className="text-base text-slate-600 italic border-l-2 border-blue-500 pl-4 py-1.5 my-6 bg-slate-50/70 rounded-r">
        {post.excerpt}
      </p>

      <div className="text-slate-700 leading-relaxed text-base pt-4 border-t border-slate-100">
        {post.content}
      </div>

      {/* Məqalə Sonu Naviqasiyası */}
      <div className="mt-10 pt-6 border-t border-slate-100 flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors group"
        >
          <span className="group-hover:-translate-x-0.5 transition-transform">←</span>
          <span>Bütün yazılara qayıt</span>
        </Link>
        <span className="text-xs text-slate-400">
          Kateqoriya: <strong className="text-slate-600 font-semibold">{post.category}</strong>
        </span>
      </div>
    </article>
  );
}
