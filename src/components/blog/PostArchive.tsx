"use client";

import { fetchMorePosts } from "@/actions/posts";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { useStoredView } from "@/hooks/useStoredView";
import type { PostSummary } from "@/types/post";
import LoadingDots from "@/components/ui/LoadingDots";
import PostCollection from "./PostCollection";
import ViewToggle from "./ViewToggle";
import { useDictionary } from "@/i18n/client";

interface PostArchiveProps {
  /** Serverdə render olunmuş ilk partiya (SSR / SEO). */
  initialPosts: PostSummary[];
  initialHasMore: boolean;
  /** Filtrsiz halda göstərilən ümumi yazı sayı. */
  total: number;
  isFiltered: boolean;
  query?: string;
  category?: string;
  /** Hero-dakı seçilmiş yazının id-si — siyahıda təkrarlanmasın deyə kənarda saxlanılır. */
  featuredId?: string;
}

/**
 * Client Component:
 * Yazı arxivinin başlıq + görünüş keçidi + siyahı + sonsuz-scroll hissəsi.
 * Görünüş keçidi tamamilə client-side-dır (server sorğusu yox, skeleton yox, scroll itmir).
 */
export default function PostArchive({
  initialPosts,
  initialHasMore,
  total,
  isFiltered,
  query,
  category,
  featuredId,
}: PostArchiveProps) {
  const dict = useDictionary();
  const [view, setView] = useStoredView();

  const {
    posts: appended,
    hasMore,
    isLoading,
    isEndMessageVisible,
    sentinelRef,
  } = useInfiniteScroll({
    initialHasMore,
    query,
    category,
    excludeId: featuredId,
    fetchAction: fetchMorePosts,
    cacheKey: `posts:${query ?? ""}:${category ?? "All"}`,
    knownSlugs: initialPosts.map((p) => p.slug),
  });

  const items =
    appended.length > 0 ? [...initialPosts, ...appended] : initialPosts;
  const count = isFiltered
    ? `${items.length}${hasMore ? "+" : ""}`
    : String(total);

  return (
    <section aria-label={dict.home.allPosts}>
      <div className="mb-5 flex items-center justify-between gap-4 border-b border-slate-200 pb-3 dark:border-slate-800">
        <h2 className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-slate-50">
          {isFiltered ? dict.home.results : dict.home.allPosts}
          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-500 dark:bg-slate-800 dark:text-slate-400">
            {count}
          </span>
        </h2>
        <ViewToggle value={view} onChange={setView} />
      </div>

      <PostCollection view={view} posts={items} />

      <div
        ref={sentinelRef}
        className="flex h-10 items-center justify-center py-3"
      >
        {isLoading ? (
          <LoadingDots text={dict.home.loadingMore} />
        ) : !hasMore && items.length > 0 ? (
          <span
            className={`text-xs font-medium uppercase tracking-wider text-slate-400 transition-opacity duration-700 dark:text-slate-600 ${
              isEndMessageVisible ? "opacity-100" : "opacity-0"
            }`}
          >
            {dict.home.endOfArchive}
          </span>
        ) : null}
      </div>
    </section>
  );
}
