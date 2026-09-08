import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { getPostBySlug } from "@/lib/posts";
import { getCurrentUser } from "@/lib/auth";
import { canManagePost } from "@/lib/permissions";
import DeletePostButton from "@/components/blog/DeletePostButton";

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
  const [post, currentUser] = await Promise.all([getPostBySlug(slug), getCurrentUser()]);

  if (!post) {
    notFound();
  }

  const canManage = canManagePost(currentUser, post);

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

      {/* Müəllif / Admin üçün idarəetmə paneli */}
      {canManage && (
        <div className="flex flex-wrap items-center gap-2.5 mb-6 -mt-1 pb-5 border-b border-dashed border-slate-200">
          <Link
            href={`/edit-post/${post.slug}`}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-blue-700 border border-blue-200 bg-white hover:bg-blue-50 transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125" />
            </svg>
            <span>Redaktə et</span>
          </Link>
          <DeletePostButton postId={post.id} />
        </div>
      )}

      <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-2 mb-4 leading-tight">
        {post.title}
      </h1>

      <p className="text-base text-slate-600 italic border-l-2 border-blue-500 pl-4 py-1.5 my-6 bg-slate-50/70 rounded-r">
        {post.excerpt}
      </p>

      <div className="text-slate-800 leading-relaxed text-base pt-6 border-t border-slate-100 whitespace-pre-line">
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
