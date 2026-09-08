import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import SearchAndFilter from "@/components/blog/SearchAndFilter";
import PostList from "@/components/blog/PostList";
import PostGridSkeleton from "@/components/ui/PostGridSkeleton";
import HomeHero from "@/components/blog/HomeHero";
import HomeHeroSkeleton from "@/components/blog/HomeHeroSkeleton";

export const metadata: Metadata = {
  title: "Mühəndislik yazıları",
  description:
    "Next.js 16, PostgreSQL, Prisma və sistem arxitekturası haqqında dərin mühəndislik qeydləri.",
};

interface HomePageProps {
  searchParams: Promise<{ q?: string; category?: string }>;
}

/**
 * Server Component (ana səhifə):
 * - Filtr yoxdursa: "Seçilmiş yazı" hero-su ayrıca Suspense sərhədində stream olunur.
 * - Axtarış aktivdirsə: hero gizlənir, sakit nəticə başlığı göstərilir.
 * - Yazı siyahısı `q` + `category` açarı ilə ayrıca stream olunur (görünüş keçidi remount etmir).
 */
export default async function HomePage({ searchParams }: HomePageProps) {
  const { q, category } = await searchParams;
  const query = q?.trim() || undefined;
  const hasFilter = Boolean(query || (category && category !== "All"));

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
      <h1 className="sr-only">Mühəndislik yazıları</h1>

      {!hasFilter && (
        <Suspense fallback={<HomeHeroSkeleton />}>
          <HomeHero />
        </Suspense>
      )}

      {query && (
        <div className="mb-6 flex items-center justify-between gap-4">
          <h2 className="text-lg font-semibold text-slate-900">
            &laquo;{query}&raquo; üzrə nəticələr
          </h2>
          <Link
            href="/"
            className="shrink-0 text-sm font-medium text-accent hover:text-accent-hover"
          >
            Arxivə qayıt
          </Link>
        </div>
      )}

      <SearchAndFilter />

      <Suspense
        key={`${query ?? ""}-${category ?? ""}`}
        fallback={<PostGridSkeleton />}
      >
        <PostList
          query={query}
          category={category}
          withFeatured={!hasFilter}
        />
      </Suspense>
    </main>
  );
}
