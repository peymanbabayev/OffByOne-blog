import Image from "next/image";
import Link from "@/i18n/navigation";
import { getHomeFeed } from "@/lib/posts";
import { BLOG_CONFIG } from "@/constants/blog";
import { formatLocaleDate } from "@/i18n/format";
import { getDictionary, getLang } from "@/i18n/dictionaries";

/**
 * Server Component:
 * Ana səhifənin "Seçilmiş yazı" bloku — tək, sakit editorial kart.
 * Seçim məntiqi tamamilə `getHomeFeed()`-in içindədir (gündəlik fırlanan determinist seçim;
 * sonradan oxunma/bəyənmə sıralamasına keçəcək).
 */
export default async function HomeHero() {
  const [{ featured }, dict, lang] = await Promise.all([
    getHomeFeed(),
    getDictionary(),
    getLang(),
  ]);
  if (!featured) return null;

  const date = formatLocaleDate(featured.createdAt, lang);
  const authorName = featured.author?.name ?? BLOG_CONFIG.author.name;
  const href = `/blog/${featured.slug}`;

  return (
    <section className="mb-10" aria-label={dict.home.featuredLabel}>
      <article className="surface-card overflow-hidden p-6 transition-colors hover:border-slate-300 sm:p-8 dark:hover:border-slate-700">
        {featured.coverImage && (
          <Link
            href={href}
            className="relative -mx-6 -mt-6 mb-6 block aspect-[21/9] overflow-hidden border-b border-slate-100 bg-slate-50 sm:-mx-8 sm:-mt-8 dark:border-slate-800 dark:bg-slate-800/50"
          >
            <Image
              src={featured.coverImage}
              alt={featured.title}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 768px"
              className="object-cover"
            />
          </Link>
        )}

        <div className="mb-4 flex items-center gap-3">
          <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-accent">
            {dict.home.featuredLabel}
          </span>
          <span className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
          <time className="text-xs text-slate-400 dark:text-slate-500">{date}</time>
        </div>

        <Link href={href} className="group block">
          <h2 className="text-balance text-2xl font-bold leading-tight tracking-tight text-slate-900 transition-colors group-hover:text-accent sm:text-3xl dark:text-slate-50">
            {featured.title}
          </h2>
        </Link>

        <p className="mt-3 max-w-2xl leading-relaxed text-slate-600 line-clamp-2 dark:text-slate-400">
          {featured.excerpt}
        </p>

        <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-500 dark:text-slate-400">
          <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-100 px-2.5 py-0.5 font-medium text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
            {featured.category}
          </span>
          <span>{authorName}</span>
          <span className="text-slate-300 dark:text-slate-700">·</span>
          <span>
            {featured.readingMinutes} {dict.postMeta.readingMinutes}
          </span>
          <Link
            href={href}
            className="ml-auto inline-flex items-center gap-1 font-semibold text-accent hover:text-accent-hover"
          >
            {dict.home.readAction} <span aria-hidden>→</span>
          </Link>
        </div>
      </article>
    </section>
  );
}
