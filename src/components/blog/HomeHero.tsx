import Link from "next/link";
import { getHomeFeed } from "@/lib/posts";
import { BLOG_CONFIG } from "@/constants/blog";
import { formatAzDate } from "@/lib/format";

/**
 * Server Component:
 * Ana səhifənin "Seçilmiş yazı" bloku — tək, sakit editorial kart.
 * Seçim məntiqi tamamilə `getHomeFeed()`-in içindədir (gündəlik fırlanan determinist seçim;
 * sonradan oxunma/bəyənmə sıralamasına keçəcək).
 */
export default async function HomeHero() {
  const { featured } = await getHomeFeed();
  if (!featured) return null;

  const date = formatAzDate(featured.createdAt);
  const authorName = featured.author?.name ?? BLOG_CONFIG.author.name;
  const href = `/blog/${featured.slug}`;

  return (
    <section className="mb-10" aria-label="Seçilmiş yazı">
      <article className="surface-card p-6 transition-colors hover:border-slate-300 sm:p-8">
        <div className="mb-4 flex items-center gap-3">
          <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-accent">
            Seçilmiş
          </span>
          <span className="h-px flex-1 bg-slate-200" />
          <time className="text-xs text-slate-400">{date}</time>
        </div>

        <Link href={href} className="group block">
          <h2 className="text-balance text-2xl font-bold leading-tight tracking-tight text-slate-900 transition-colors group-hover:text-accent sm:text-3xl">
            {featured.title}
          </h2>
        </Link>

        <p className="mt-3 max-w-2xl leading-relaxed text-slate-600 line-clamp-2">
          {featured.excerpt}
        </p>

        <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-500">
          <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-100 px-2.5 py-0.5 font-medium text-slate-700">
            {featured.category}
          </span>
          <span>{authorName}</span>
          <span className="text-slate-300">·</span>
          <span>{featured.readingMinutes} dəq oxuma</span>
          <Link
            href={href}
            className="ml-auto inline-flex items-center gap-1 font-semibold text-accent hover:text-accent-hover"
          >
            Oxu <span aria-hidden>→</span>
          </Link>
        </div>
      </article>
    </section>
  );
}
