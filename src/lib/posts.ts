import "server-only";
import { cache } from "react";
import { prisma } from "./prisma";

/**
 * Bütün postları Neon bazasından gətirən asinxron funksiya.
 */
export async function getPosts() {
  return await prisma.post.findMany({
    orderBy: {
      createdAt: "desc",
    },
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
  });
});
