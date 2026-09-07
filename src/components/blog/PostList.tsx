import { getPosts } from "@/lib/posts";
import type { GetPostsOptions } from "@/types/post";
import { POSTS_PER_PAGE } from "@/constants/blog";
import EmptyState from "@/components/ui/EmptyState";
import PostCard from "./PostCard";
import InfinitePostScroll from "./InfinitePostScroll";

/**
 * Server Component:
 * Prisma vasitəsilə filtr parametrlərinə uyğun ilk partiyanı birbaşa serverdə çəkir (SSR).
 * Aşağı scroll etdikcə növbəti məqalələri yükləmək üçün isə InfinitePostScroll komponentindən istifadə edir.
 */
export default async function PostList(options: GetPostsOptions) {
  const { query, category } = options;

  // 1. İlk partiya məqalələri birbaşa Serverdə Neon bazasından çəkirik
  const initialPosts = await getPosts({
    query,
    category,
    page: 1,
    limit: POSTS_PER_PAGE,
  });

  const isFiltered = Boolean(query || (category && category !== "All"));

  // 2. Əgər heç bir post tapılmadısa, təmiz EmptyState göstəririk
  if (initialPosts.length === 0) {
    return (
      <EmptyState
        icon="🔍"
        title="Axtarışınıza uyğun heç bir məqalə tapılmadı"
        description={
          <>
            &quot;{query || category}&quot; üzrə heç bir qeyd mövcud deyil. Açar sözü dəyişməyə və ya filtrləri sıfırlamağa çalışın.
          </>
        }
        action={{
          label: "Filtrləri sıfırla və bütün yazıları göstər",
          href: "/",
        }}
      />
    );
  }

  // İlk partiyada tam limit qədər post gəlibsə, deməli davamı ola bilər
  const initialHasMore = initialPosts.length === POSTS_PER_PAGE;

  return (
    <section>
      {/* Başlıq Paneli */}
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-200/70">
        <div className="flex items-center gap-3">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            {isFiltered ? "Axtarış Nəticələri" : "Son Yazılar"}
          </h2>
        </div>
      </div>

      {/* 3. İlkin Məqalələr Qridi (100% Server Component - SEO və sürət üçün) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {initialPosts.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>

      {/* 4. Aşağı scroll etdikcə yüklənən hissə (Client Component + Server Action) */}
      <InfinitePostScroll
        initialHasMore={initialHasMore}
        query={query}
        category={category}
      />
    </section>
  );
}
