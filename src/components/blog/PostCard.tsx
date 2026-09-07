import Link from "next/link";
import type { PostSummary } from "@/types/post";
import LikeButton from "./LikeButton";

interface PostCardProps {
  post: PostSummary;
}

/**
 * Server Component:
 * Hər bir fərdi məqalə kartını təmsil edir.
 * Daxilində interaktiv LikeButton (Client Component) saxlayır.
 */
export default function PostCard({ post }: PostCardProps) {
  const formattedDate = new Date(post.createdAt).toLocaleDateString("az-AZ", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <article className="group relative flex flex-col justify-between bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-7 shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-xl hover:border-blue-200 hover:-translate-y-1.5 transition-all duration-300">
      <div>
        {/* Kateqoriya və Tarix */}
        <div className="flex items-center justify-between gap-2 mb-3.5">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-100/80">
            {post.category}
          </span>
          <time className="text-xs font-medium text-slate-400">
            {formattedDate}
          </time>
        </div>

        {/* Başlıq və Qısa Məzmun */}
        <Link href={`/blog/${post.slug}`} className="block focus:outline-none">
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2 leading-snug">
            {post.title}
          </h2>
          <p className="mt-2.5 text-sm text-slate-600 leading-relaxed line-clamp-3">
            {post.excerpt}
          </p>
        </Link>
      </div>

      {/* Alt Hissə: Ətraflı Keçid və Like Düyməsi */}
      <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
        <Link
          href={`/blog/${post.slug}`}
          className="inline-flex items-center text-xs font-semibold text-blue-600 group-hover:text-blue-700 transition-colors"
        >
          <span>Oxumağa başla</span>
          <span className="ml-1 transition-transform duration-200 group-hover:translate-x-1">→</span>
        </Link>

        <LikeButton />
      </div>
    </article>
  );
}
