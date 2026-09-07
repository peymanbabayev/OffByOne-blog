import { useEffect, useRef, useState } from "react";
import type { GetPostsOptions, PostSummary } from "@/types/post";
import { POSTS_PER_PAGE } from "@/constants/blog";

interface UseInfiniteScrollOptions {
  initialHasMore: boolean;
  query?: string;
  category?: string;
  fetchAction: (options: GetPostsOptions) => Promise<PostSummary[]>;
}

/**
 * Custom React Hook:
 * Sonsuz sürüşdürmə (Infinite Scroll) məntiqini UI-dan tamamilə təcrid edir.
 * 
 * - IntersectionObserver-i sabit saxlayır (Observer Churn yaratmır).
 * - Asinxron callback daxilində ən son vəziyyəti oxumaq üçün useRef tətbiq edir.
 * - Səhifələmə parametrini artırır və Server Action-u çağırır.
 * - Baza bitdikdə zərif fade-out vaxtını idarə edir.
 */
export function useInfiniteScroll({
  initialHasMore,
  query,
  category,
  fetchAction,
}: UseInfiniteScrollOptions) {
  // 1. UI üçün State-lər
  const [posts, setPosts] = useState<PostSummary[]>([]);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [isLoading, setIsLoading] = useState(false);
  const [isEndMessageVisible, setIsEndMessageVisible] = useState(false);

  // 2. Observer daxilində daima ən son dəyərləri təhlükəsiz oxumaq üçün Ref-lər
  const pageRef = useRef(1);
  const isLoadingRef = useRef(false);
  const hasMoreRef = useRef(initialHasMore);
  const sentinelRef = useRef<HTMLDivElement>(null);

  // İlkin status dəyişdikdə sinxronlaşdırırıq
  useEffect(() => {
    hasMoreRef.current = initialHasMore;
    setHasMore(initialHasMore);
  }, [initialHasMore]);

  // Ağıllı Bildiriş: Yalnız əlavə postlar çəkilib bitdikdə (posts.length > 0 && !hasMore) çıxır
  useEffect(() => {
    if (!hasMore && posts.length > 0) {
      setIsEndMessageVisible(true);

      const fadeTimer = setTimeout(() => {
        setIsEndMessageVisible(false);
      }, 2500);

      return () => clearTimeout(fadeTimer);
    }
  }, [hasMore, posts.length]);

  // Tək və Sabit IntersectionObserver
  useEffect(() => {
    const currentSentinel = sentinelRef.current;
    if (!currentSentinel) return;

    const observer = new IntersectionObserver(
      async (entries) => {
        const firstEntry = entries[0];

        // Element ekrandadırsa, post qalıbsa və hazırda sorğu getmirsə
        if (
          firstEntry.isIntersecting &&
          hasMoreRef.current &&
          !isLoadingRef.current
        ) {
          isLoadingRef.current = true;
          setIsLoading(true);

          const nextPage = pageRef.current + 1;

          try {
            const newPosts = await fetchAction({
              query,
              category,
              page: nextPage,
              limit: POSTS_PER_PAGE,
            });

            if (newPosts.length < POSTS_PER_PAGE) {
              hasMoreRef.current = false;
              setHasMore(false);
            }

            if (newPosts.length > 0) {
              setPosts((prev) => [...prev, ...newPosts]);
              pageRef.current = nextPage;
            }
          } catch (error) {
            console.error("Məqalələr yüklənərkən xəta baş verdi:", error);
            hasMoreRef.current = false;
            setHasMore(false);
          } finally {
            isLoadingRef.current = false;
            setIsLoading(false);
          }
        }
      },
      {
        rootMargin: "250px", // Sona 250px qalmış qabaqcadan yükləmə
      }
    );

    observer.observe(currentSentinel);

    return () => {
      observer.disconnect();
    };
  }, [query, category, fetchAction]);

  return {
    posts,
    hasMore,
    isLoading,
    isEndMessageVisible,
    sentinelRef,
  };
}
