import "server-only";
import { cache } from "react";
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
