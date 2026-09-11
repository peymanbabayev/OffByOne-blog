"use client";

import Link from "@/i18n/navigation";
import type { PostSummary } from "@/types/post";
import { BLOG_CONFIG } from "@/constants/blog";
import { formatLocaleDate } from "@/i18n/format";
import { useLang } from "@/i18n/client";

interface PostRowProps {
  post: PostSummary;
}

/**
 * Prezentasiya komponenti — "İndeks" görünüşü üçün yüksək sıxlıqlı arxiv sətri.
 * Client Component-dir (bax: PostCard.tsx-dəki izah — `PostArchive` daxilində
 * həm server, həm client mənşəli yazıları eyni komponentlə göstərir).
 */
export default function PostRow({ post }: PostRowProps) {
  const lang = useLang();
  const date = formatLocaleDate(post.createdAt, lang);
  const authorName = post.author?.name ?? BLOG_CONFIG.author.name;

  return (
    <article className="group flex flex-col gap-1.5 py-3.5 sm:flex-row sm:items-center sm:gap-4">
      <time className="order-2 shrink-0 whitespace-nowrap font-mono text-xs text-slate-400 sm:order-1 sm:w-32 dark:text-slate-500">
        {date}
      </time>

      <span className="order-1 inline-flex w-fit shrink-0 items-center rounded border border-slate-200 bg-slate-100 px-1.5 py-0.5 text-[11px] font-medium text-slate-600 sm:order-2 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
        {post.category}
      </span>

      <Link href={`/blog/${post.slug}`} className="order-3 min-w-0 flex-1">
        <span className="block truncate text-sm font-semibold text-slate-900 transition-colors group-hover:text-accent dark:text-slate-50">
          {post.title}
        </span>
      </Link>

      <span className="order-4 hidden shrink-0 text-xs text-slate-500 sm:block sm:max-w-[140px] sm:truncate dark:text-slate-400">
        {authorName}
      </span>
      <span className="order-5 hidden shrink-0 text-accent sm:block" aria-hidden>
        →
      </span>
    </article>
  );
}
