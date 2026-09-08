import Image from "next/image";
import Link from "next/link";
import type { PostSummary } from "@/types/post";
import { BLOG_CONFIG } from "@/constants/blog";
import { formatAzDate } from "@/lib/format";

interface PostCardProps {
  post: PostSummary;
}

/**
 * Prezentasiya komponenti — qrid görünüşündə tək məqalə kartı.
 * Sakit editorial üslub: tək vurğu rəngi, `surface-card` bazası, ornament yoxdur.
 */
export default function PostCard({ post }: PostCardProps) {
  const date = formatAzDate(post.createdAt);
  const authorName = post.author?.name ?? BLOG_CONFIG.author.name;
  const href = `/blog/${post.slug}`;

  return (
    <article className="group surface-card flex flex-col overflow-hidden p-5 transition-colors hover:border-slate-300 sm:p-6">
      {post.coverImage && (
        <Link
          href={href}
          className="relative -mx-5 -mt-5 mb-4 block aspect-[16/9] overflow-hidden border-b border-slate-100 bg-slate-50 sm:-mx-6 sm:-mt-6"
        >
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 360px"
            className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
          />
        </Link>
      )}

      <div className="flex items-center gap-2 text-xs text-slate-500">
        <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-100 px-2 py-0.5 font-medium text-slate-700">
          {post.category}
        </span>
        <span className="text-slate-300">·</span>
        <time>{date}</time>
      </div>

      <Link href={href} className="mt-3 block">
        <h3 className="text-balance text-base font-semibold leading-snug text-slate-900 transition-colors line-clamp-2 group-hover:text-accent sm:text-lg">
          {post.title}
        </h3>
      </Link>

      <p className="mt-2 text-sm leading-relaxed text-slate-600 line-clamp-2">
        {post.excerpt}
      </p>

      <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-4 text-xs">
        <span className="truncate text-slate-500">{authorName}</span>
        <Link
          href={href}
          className="inline-flex shrink-0 items-center gap-1 font-semibold text-accent hover:text-accent-hover"
          aria-label={`${post.title} — oxu`}
        >
          Oxu <span aria-hidden>→</span>
        </Link>
      </div>
    </article>
  );
}
