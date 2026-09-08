import "server-only";
import { cache } from "react";
import { notFound, permanentRedirect } from "next/navigation";
import { prisma } from "./prisma";

import type { Prisma } from "@prisma/client";
import type { GetPostsOptions, PostSummary } from "@/types/post";

/**
 * Server Component və ya Route-lardan postları filtrlərlə gətirən asinxron funksiya.
 * 
 * searchParams vasitəsilə URL-dən daxil olan 'query' (axtarış mətni) və 'category'
 * dəyərlərini qəbul edir və PostgreSQL səviyyəsində səmərəli SQL WHERE filtri tətbiq edir.
 * 
 * Performans Optimizasiyası:
 * Məqalə siyahısı və kartlar üçün ağır 'content' (tam mətn) sahəsi ötürülmür,
 * yalnız 'PostSummary' sahələri SQL SELECT ilə çəkilir.
 */
export async function getPosts(options?: GetPostsOptions): Promise<PostSummary[]> {
  const { query, category, page = 1, limit = 6 } = options ?? {};

  // Prisma üçün dinamik 'where' şərt obyekti formalaşdırırıq
  const where: Prisma.PostWhereInput = {};

  // 1. Əgər kateqoriya seçilibsə və "All" (Hamısı) deyilsə:
  if (category && category !== "All") {
    where.category = category;
  }

  // 2. Əgər axtarış xanasına mətn yazılıbsa:
  // Həm başlıq (title), həm də qısa məzmunda (excerpt) case-insensitive axtarış edirik
  if (query && query.trim() !== "") {
    where.OR = [
      {
        title: {
          contains: query.trim(),
          mode: "insensitive", // Böyük/kiçik hərf həssaslığını aradan qaldırır
        },
      },
      {
        excerpt: {
          contains: query.trim(),
          mode: "insensitive",
        },
      },
    ];
  }

  // Səhifələmə (Pagination) parametrləri
  const skip = (page - 1) * limit;
  const take = limit;

  // Optimizasiya: Ağır 'content' sahəsini kənarda saxlayaraq yüngül PostSummary gətiririk
  return await prisma.post.findMany({
    where,
    select: {
      id: true,
      slug: true,
      title: true,
      excerpt: true,
      category: true,
      createdAt: true,
      updatedAt: true,
      authorId: true,
      author: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    skip,
    take,
  });
}

/**
 * Tək bir postu slug-a görə Neon bazasından gətirən funksiya.
 * React cache() sayəsində eyni səhifə açılışında dublikat sorğu getmir.
 */
export const getPostBySlug = cache(async (slug: string) => {
  return await prisma.post.findUnique({
    where: {
      slug,
    },
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
