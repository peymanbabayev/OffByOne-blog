import Link from "next/link";
import type { PostSummary } from "@/types/post";
import { BLOG_CONFIG } from "@/constants/blog";
import { formatAzDate } from "@/lib/format";

interface PostRowProps {
  post: PostSummary;
}

/**
 * Prezentasiya komponenti — "İndeks" görünüşü üçün yüksək sıxlıqlı arxiv sətri.
 */
export default function PostRow({ post }: PostRowProps) {
  const date = formatAzDate(post.createdAt);
  const authorName = post.author?.name ?? BLOG_CONFIG.author.name;

  return (
    <article className="group flex flex-col gap-1.5 py-3.5 sm:flex-row sm:items-center sm:gap-4">
      <time className="order-2 shrink-0 whitespace-nowrap font-mono text-xs text-slate-400 sm:order-1 sm:w-32">
        {date}
      </time>

      <span className="order-1 inline-flex w-fit shrink-0 items-center rounded border border-slate-200 bg-slate-100 px-1.5 py-0.5 text-[11px] font-medium text-slate-600 sm:order-2">
        {post.category}
      </span>

      <Link href={`/blog/${post.slug}`} className="order-3 min-w-0 flex-1">
        <span className="block truncate text-sm font-semibold text-slate-900 transition-colors group-hover:text-accent">
          {post.title}
        </span>
      </Link>

      <span className="order-4 hidden shrink-0 text-xs text-slate-500 sm:block sm:max-w-[140px] sm:truncate">
        {authorName}
      </span>
      <span className="order-5 hidden shrink-0 text-accent sm:block" aria-hidden>
        →
      </span>
    </article>
  );
}
