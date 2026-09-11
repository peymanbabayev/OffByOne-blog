import { getHomeFeed, getPosts } from "@/lib/posts";
import { POSTS_PER_PAGE } from "@/constants/blog";
import EmptyState from "@/components/ui/EmptyState";
import PostArchive from "./PostArchive";
import { getDictionary } from "@/i18n/dictionaries";

interface PostListProps {
  query?: string;
  category?: string;
  /** Ana səhifə (filtr yoxdur) — hero-dakı seçilmiş yazını siyahıdan kənarda saxla + ümumi sayı göstər. */
  withFeatured?: boolean;
}

/**
 * Server Component:
 * Filtr parametrlərinə uyğun ilk partiyanı serverdə çəkir (SSR), sonrasını `PostArchive`
 * (client + Server Action) idarə edir. Boş / az məzmun hallarını burada ayırır.
 */
export default async function PostList({
  query,
  category,
  withFeatured = false,
}: PostListProps) {
  const isFiltered = Boolean(
    query?.trim() || (category && category !== "All")
  );

  const dict = await getDictionary();
  const feed = withFeatured ? await getHomeFeed() : null;
  const featuredId = feed?.featured?.id;
  const total = feed?.total ?? 0;

  const initialPosts = await getPosts({
    query,
    category,
    excludeId: featuredId,
    page: 1,
    limit: POSTS_PER_PAGE,
  });

  // Bazada heç bir yazı yoxdur — ilk-dəfə vəziyyəti
  if (withFeatured && !feed?.featured && total === 0) {
    return (
      <EmptyState
        title={dict.home.noPostsYetTitle}
        description={dict.home.noPostsYetDesc}
        action={{ label: dict.home.writeNewPost, href: "/new-post" }}
      />
    );
  }

  // Filtr aktivdir, nəticə yoxdur
  if (isFiltered && initialPosts.length === 0) {
    return (
      <EmptyState
        title={dict.home.noResultsTitle}
        description={
          <>
            &laquo;{query || category}&raquo; {dict.home.noResultsDesc}
          </>
        }
        action={{ label: dict.home.resetFilters, href: "/" }}
      />
    );
  }

  // Yalnız seçilmiş yazı var, siyahı boşdur
  if (withFeatured && initialPosts.length === 0) {
    return (
      <p className="rounded-card border border-dashed border-slate-300 bg-white px-5 py-8 text-center text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400">
        {dict.home.comingSoon}
      </p>
    );
  }

  return (
    <PostArchive
      initialPosts={initialPosts}
      initialHasMore={initialPosts.length === POSTS_PER_PAGE}
      total={total}
      isFiltered={isFiltered}
      query={query}
      category={category}
      featuredId={featuredId}
    />
  );
}
