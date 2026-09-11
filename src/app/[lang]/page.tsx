import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "@/i18n/navigation";
import SearchAndFilter from "@/components/blog/SearchAndFilter";
import PostList from "@/components/blog/PostList";
import PostGridSkeleton from "@/components/ui/PostGridSkeleton";
import HomeHero from "@/components/blog/HomeHero";
import { getDictionary, getDictionaryFor } from "@/i18n/dictionaries";
import { isLocale, defaultLocale } from "@/i18n/config";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const dict = getDictionaryFor(isLocale(lang) ? lang : defaultLocale);
  return {
    title: dict.meta.homeTitle,
    description: dict.meta.defaultDescription,
  };
}

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
  const [{ q, category }, dict] = await Promise.all([searchParams, getDictionary()]);
  const query = q?.trim() || undefined;
  const hasFilter = Boolean(query || (category && category !== "All"));

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
      <h1 className="sr-only">{dict.home.srTitle}</h1>

      {!hasFilter && <HomeHero />}

      {query && (
        <div className="mb-6 flex items-center justify-between gap-4">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50">
            &laquo;{query}&raquo; {dict.home.resultsFor}
          </h2>
          <Link
            href="/"
            className="shrink-0 text-sm font-medium text-accent hover:text-accent-hover"
          >
            {dict.home.backToArchive}
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
