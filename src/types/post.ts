import type { Post as PrismaPost } from "@prisma/client";

/**
 * Baza səviyyəsində Post modelinin tam tipi.
 * Prisma-nın generasiya etdiyi tipə əsaslanır, beləliklə DB dəyişdikdə tiplər avtomatik uyğunlaşır.
 */
export type Post = PrismaPost;

/**
 * Ana səhifədəki kartlar üçün lazım olan yığcam tip (content sahəsi olmadan).
 * Performans baxımından yalnız lazım olan sahələri daşıyır.
 */
export type PostSummary = Omit<Post, "content">;

/**
 * Postları bazadan gətirərkən qəbul edilən axtarış və filtr parametrləri.
 */
export interface GetPostsOptions {
  query?: string;
  category?: string;
}
