"use client";

import { fetchMorePosts } from "@/actions/posts";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import LoadingDots from "@/components/ui/LoadingDots";
import PostCard from "./PostCard";

interface InfinitePostScrollProps {
  initialHasMore: boolean;
  query?: string;
  category?: string;
  /** Serverdə render olunmuş ilk partiyanın slug-ları — dublikatın qarşısını almaq üçün. */
  initialSlugs: string[];
}

/**
 * Client Component (Təmiz Presentation Layer):
 * 
 * Bütün asinxron observer, taymer və səhifələmə məntiqi 'useInfiniteScroll' hook-una həvalə edilib.
 * Bu komponent yalnız və yalnız təmiz UI render etməklə məşğuldur:
 * - Yeni gələn məqalələrin qridi
 * - Sabit hündürlüklü status sahəsi (LoadingDots və ya Bütün məqalələrə baxdınız qeydi)
 */
export default function InfinitePostScroll({
  initialHasMore,
  query,
  category,
  initialSlugs,
}: InfinitePostScrollProps) {
  // Bütün mürəkkəb məntiqi təmiz custom hook idarə edir
  const { posts, hasMore, isLoading, isEndMessageVisible, sentinelRef } =
    useInfiniteScroll({
      initialHasMore,
      query,
      category,
      fetchAction: fetchMorePosts,
      cacheKey: `posts:${query ?? ""}:${category ?? "All"}`,
      knownSlugs: initialSlugs,
    });

  return (
    <>
      {/* Scroll edildikcə əlavə olunan yeni məqalələr */}
      {posts.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mt-6 sm:mt-8">
          {posts.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      )}

      {/* 
        İzləyici Sentinel və Status Sahəsi:
        Hündürlük (h-10) sabitdir, buna görə sıçrayış (layout shift) baş vermir.
      */}
      <div
        ref={sentinelRef}
        className="h-10 flex items-center justify-center my-3"
      >
        {isLoading ? (
          <LoadingDots text="Növbəti məqalələr yüklənir..." />
        ) : !hasMore && posts.length > 0 ? (
          <div
            className={`text-xs font-semibold text-slate-400 uppercase tracking-wider transition-opacity duration-1000 ease-out pointer-events-none select-none ${
              isEndMessageVisible ? "opacity-100" : "opacity-0"
            }`}
          >
            <span>🎉 Bütün məqalələrə baxdınız</span>
          </div>
        ) : null}
      </div>
    </>
  );
}
