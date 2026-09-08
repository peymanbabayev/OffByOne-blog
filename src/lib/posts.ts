import "server-only";
import { cache } from "react";
import { notFound, permanentRedirect } from "next/navigation";
import { prisma } from "./prisma";
import { estimateReadingTime } from "./reading-time";

import type { Prisma } from "@prisma/client";
import type { FeaturedPost, GetPostsOptions, PostSummary } from "@/types/post";

/**
 * Kartlar və siyahılar üçün ortaq SELECT.
 * Ağır `content` sahəsi buraya daxil DEYİL — `PostSummary` yüngül qalır.
 */
const POST_SUMMARY_SELECT = {
  id: true,
  slug: true,
  title: true,
  excerpt: true,
  category: true,
  createdAt: true,
  updatedAt: true,
  authorId: true,
  author: {
    select: { id: true, name: true, email: true, role: true },
  },
} satisfies Prisma.PostSelect;

/** Axtarış mətninin maksimum uzunluğu (DoS və mənasız ILIKE sorğularının qarşısını alır). */
const MAX_QUERY_LENGTH = 100;

/** Hero-dakı "Seçilmiş yazı" hansı yazılar arasından seçilir (ən yeni N). */
const FEATURED_POOL_SIZE = 15;
const DAY_MS = 86_400_000;

/**
 * Filtr parametrlərindən Prisma `where` şərtini qurur.
 * Axtarış həm başlıq, həm qısa məzmun, həm də tam mətn (`content`) üzrə aparılır.
 */
function buildPostWhere(
  options: Pick<GetPostsOptions, "query" | "category" | "excludeId">
): Prisma.PostWhereInput {
  const where: Prisma.PostWhereInput = {};

  if (options.category && options.category !== "All") {
    where.category = options.category;
  }

  const term = options.query?.trim().slice(0, MAX_QUERY_LENGTH);
  if (term) {
    where.OR = [
      { title: { contains: term, mode: "insensitive" } },
      { excerpt: { contains: term, mode: "insensitive" } },
      { content: { contains: term, mode: "insensitive" } },
    ];
  }

  if (options.excludeId) {
    where.id = { not: options.excludeId };
  }

  return where;
}

/**
 * Filtr və səhifələmə parametrlərinə uyğun yüngül `PostSummary` siyahısı qaytarır.
 * Ana səhifədə ilk partiya (SSR) və sonsuz-scroll üçün Server Action buradan qidalanır.
 */
export async function getPosts(options?: GetPostsOptions): Promise<PostSummary[]> {
  const { page = 1, limit = 6 } = options ?? {};
  const skip = (page - 1) * limit;

  return prisma.post.findMany({
    where: buildPostWhere(options ?? {}),
    select: POST_SUMMARY_SELECT,
    orderBy: { createdAt: "desc" },
    skip,
    take: limit,
  });
}

/**
 * Tək bir postu slug-a görə Neon bazasından gətirən funksiya.
 * React cache() sayəsində eyni səhifə açılışında dublikat sorğu getmir.
 */
export const getPostBySlug = cache(async (slug: string) => {
  return prisma.post.findUnique({
    where: { slug },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true,
          _count: {
            select: { posts: true },
          },
        },
      },
    },
  });
});

/**
 * `/blog/[slug]` səhifəsi (layout + page) üçün slug həlli:
 * - aktiv slug → postu qaytarır
 * - köhnə (dəyişdirilmiş) slug → cari ünvana KALICI (308) yönləndirir
 * - heç biri → 404
 *
 * React `cache()` ilə əhatələnib: layout və page eyni sorğuda çağırsa da bir dəfə işləyir.
 */
export const getPostForView = cache(async (slug: string) => {
  const post = await getPostBySlug(slug);
  if (post) return post;

  const alias = await prisma.postSlugHistory.findUnique({
    where: { slug },
    select: { post: { select: { slug: true } } },
  });

  if (alias?.post) {
    permanentRedirect(`/blog/${alias.post.slug}`);
  }

  notFound();
});

/**
 * Ana səhifə üçün: ümumi yazı sayı + hero-da göstəriləcək "Seçilmiş yazı".
 *
 * Seçilmiş yazı hazırda ən yeni {@link FEATURED_POOL_SIZE} yazı arasından gün nömrəsinə görə
 * determinist şəkildə seçilir (gündəlik fırlanır, bir sorğu daxilində stabildir).
 * TODO(analytics): oxunma/bəyənmə izlənəndən sonra bu seçim son 7 günün ən çox oxunanına keçəcək.
 *
 * `React.cache` ilə əhatələnib — hero və `PostList` eyni sorğuda çağırsa da bir dəfə işləyir.
 */
export const getHomeFeed = cache(
  async (): Promise<{ featured: FeaturedPost | null; total: number }> => {
    const [total, pool] = await Promise.all([
      prisma.post.count(),
      prisma.post.findMany({
        orderBy: { createdAt: "desc" },
        take: FEATURED_POOL_SIZE,
        select: { id: true },
      }),
    ]);

    if (pool.length === 0) return { featured: null, total };

    const index = Math.floor(Date.now() / DAY_MS) % pool.length;
    const post = await prisma.post.findUnique({
      where: { id: pool[index].id },
      select: { ...POST_SUMMARY_SELECT, content: true },
    });

    if (!post) return { featured: null, total };

    const { content, ...summary } = post;
    return {
      featured: { ...summary, readingMinutes: estimateReadingTime(content) },
      total,
    };
  }
);

/**
 * Spotlight (⌘K) sürətli keçid pəncərəsi üçün axtarış.
 * Nəticələr yüngüldür və birbaşa yazıya keçid üçün nəzərdə tutulub (siyahı filtri deyil).
 */
export async function searchPostsForPalette(
  query: string,
  limit = 7
): Promise<PostSummary[]> {
  const term = query.trim();
  if (term.length < 2) return [];

  return prisma.post.findMany({
    where: buildPostWhere({ query: term }),
    select: POST_SUMMARY_SELECT,
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}
