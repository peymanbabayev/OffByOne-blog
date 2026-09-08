import { useEffect, useLayoutEffect, useRef, useState } from "react";
import type { GetPostsOptions, PostSummary } from "@/types/post";
import { POSTS_PER_PAGE } from "@/constants/blog";
import {
  isBackForwardNavigation,
  readScrollSnapshot,
  writeScrollSnapshot,
} from "@/lib/scroll-restoration";

/**
 * SSR zamanı `useLayoutEffect` xəbərdarlıq verir; serverdə `useEffect`, brauzerdə
 * `useLayoutEffect` işlədirik ki, bərpa paint-dən əvvəl baş versin.
 */
const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

interface UseInfiniteScrollOptions {
  initialHasMore: boolean;
  query?: string;
  category?: string;
  /** Nəticədən kənarda saxlanılacaq post id-si (hero-dakı seçilmiş yazı təkrarlanmasın). */
  excludeId?: string;
  fetchAction: (options: GetPostsOptions) => Promise<PostSummary[]>;
  /**
   * Verildikdə, əlavə yüklənmiş məqalələr + scroll mövqeyi `sessionStorage`-də
   * bu açar altında saxlanılır və brauzerin geri/irəli naviqasiyasında bərpa olunur.
   */
  cacheKey?: string;
  /** İlkin (serverdə render olunmuş) məqalələrin slug-ları — dublikat qarşısını almaq üçün. */
  knownSlugs?: readonly string[];
}

/**
 * Custom React Hook:
 * Sonsuz sürüşdürmə (Infinite Scroll) məntiqini UI-dan tamamilə təcrid edir.
 *
 * - IntersectionObserver-i sabit saxlayır (Observer Churn yaratmır).
 * - Asinxron callback daxilində ən son vəziyyəti oxumaq üçün useRef tətbiq edir.
 * - Səhifələmə parametrini artırır və Server Action-u çağırır.
 * - Baza bitdikdə zərif fade-out vaxtını idarə edir.
 * - `cacheKey` verildikdə: "geri" düyməsi ilə qayıdanda yüklənmiş məqalələri və
 *   scroll mövqeyini bərpa edir (best-practice scroll restoration).
 */
export function useInfiniteScroll({
  initialHasMore,
  query,
  category,
  excludeId,
  fetchAction,
  cacheKey,
  knownSlugs,
}: UseInfiniteScrollOptions) {
  // 1. UI üçün State-lər
  const [posts, setPosts] = useState<PostSummary[]>([]);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [isLoading, setIsLoading] = useState(false);
  const [isEndMessageVisible, setIsEndMessageVisible] = useState(false);

  // `cacheKey` yoxdursa bərpaya ehtiyac yoxdur — dərhal "hazır"
  const [isRestored, setIsRestored] = useState(!cacheKey);

  // 2. Observer daxilində daima ən son dəyərləri təhlükəsiz oxumaq üçün Ref-lər
  const pageRef = useRef(1);
  const isLoadingRef = useRef(false);
  const hasMoreRef = useRef(initialHasMore);
  const sentinelRef = useRef<HTMLDivElement>(null);

  // Bərpa & yadda saxlama üçün ref-lər
  const seenSlugsRef = useRef<Set<string>>(new Set(knownSlugs));
  const pendingScrollYRef = useRef<number | null>(null);

  // Ən son vəziyyətin snapshot-u (unmount/pagehide/scroll zamanı sinxron oxumaq üçün).
  // Hər render-dən sonra effect-də yenilənir ki, render fazasında ref-ə toxunmayaq.
  const snapshotRef = useRef<{
    posts: PostSummary[];
    page: number;
    hasMore: boolean;
  }>({ posts: [], page: 1, hasMore: initialHasMore });

  useEffect(() => {
    snapshotRef.current = { posts, page: pageRef.current, hasMore };
  });

  // İlkin status dəyişdikdə sinxronlaşdırırıq
  useEffect(() => {
    hasMoreRef.current = initialHasMore;
    setHasMore(initialHasMore);
  }, [initialHasMore]);

  // --- Bərpa: mount zamanı, paint-dən əvvəl (yalnız geri/irəli naviqasiyada) ---
  useIsomorphicLayoutEffect(() => {
    if (!cacheKey) return;

    const snap = isBackForwardNavigation()
      ? readScrollSnapshot<PostSummary>(cacheKey)
      : null;

    if (snap && snap.items.length > 0) {
      const deduped = snap.items.filter((p) => {
        if (seenSlugsRef.current.has(p.slug)) return false;
        seenSlugsRef.current.add(p.slug);
        return true;
      });

      if (deduped.length > 0) {
        setPosts(deduped);
        pageRef.current = snap.page;
        hasMoreRef.current = snap.hasMore;
        setHasMore(snap.hasMore);
        pendingScrollYRef.current = snap.scrollY;
      }
    }

    setIsRestored(true);
  }, []); // yalnız mount

  // Bərpa edilmiş məqalələr render olunandan sonra scroll mövqeyini geri qaytarırıq
  useIsomorphicLayoutEffect(() => {
    const y = pendingScrollYRef.current;
    if (y == null || posts.length === 0) return;

    window.scrollTo(0, y);
    // Layout tam oturduqdan sonra bir dəfə də dəqiqləşdiririk
    const raf = requestAnimationFrame(() => {
      if (pendingScrollYRef.current != null) {
        window.scrollTo(0, pendingScrollYRef.current);
        pendingScrollYRef.current = null;
      }
    });
    return () => cancelAnimationFrame(raf);
  }, [posts.length]);

  // --- Yadda saxlama: snapshot-ı sürüşdürmə zamanı (throttle), pagehide-də və unmount-da yazırıq ---
  useEffect(() => {
    if (!cacheKey) return;

    const save = () => {
      if (!cacheKey) return;
      const s = snapshotRef.current;
      // Heç bir əlavə məqalə yüklənməyibsə mövcud snapshot-a toxunmuruq
      if (s.posts.length === 0) return;

      // Keçid zamanı Next səhifəni yuxarı sürüşdürür; scrollY=0-ı əvvəlki
      // (etibarlı) mövqe ilə əvəz etmirik.
      let scrollY = window.scrollY;
      if (scrollY === 0) {
        scrollY = readScrollSnapshot<PostSummary>(cacheKey)?.scrollY ?? 0;
      }

      writeScrollSnapshot(cacheKey, {
        items: s.posts,
        page: s.page,
        hasMore: s.hasMore,
        scrollY,
      });
    };

    let throttleTimer: ReturnType<typeof setTimeout> | null = null;
    const onScroll = () => {
      if (throttleTimer) return;
      throttleTimer = setTimeout(() => {
        throttleTimer = null;
        save();
      }, 400);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("pagehide", save);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pagehide", save);
      if (throttleTimer) clearTimeout(throttleTimer);
      save(); // Link ilə keçid (komponent unmount olur) — son vəziyyəti yaz
    };
  }, [cacheKey]);

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

  // Tək və Sabit IntersectionObserver (yalnız bərpa bitdikdən sonra qoşulur)
  useEffect(() => {
    if (!isRestored) return;

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
              excludeId,
              page: nextPage,
              limit: POSTS_PER_PAGE,
            });

            if (newPosts.length < POSTS_PER_PAGE) {
              hasMoreRef.current = false;
              setHasMore(false);
            }

            const freshPosts = newPosts.filter((p) => {
              if (seenSlugsRef.current.has(p.slug)) return false;
              seenSlugsRef.current.add(p.slug);
              return true;
            });

            if (freshPosts.length > 0) {
              setPosts((prev) => [...prev, ...freshPosts]);
            }
            pageRef.current = nextPage;
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
  }, [query, category, excludeId, fetchAction, isRestored]);

  return {
    posts,
    hasMore,
    isLoading,
    isEndMessageVisible,
    sentinelRef,
  };
}
