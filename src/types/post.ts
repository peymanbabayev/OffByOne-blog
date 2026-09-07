import type { Post as PrismaPost } from "@prisma/client";

export interface PostAuthor {
  id: string;
  name: string;
  email: string;
  role: "USER" | "ADMIN";
}

/**
 * Baza səviyyəsində Post modelinin müəllif əlaqəsi ilə birlikdə tam tipi.
 */
export type Post = PrismaPost & {
  author?: PostAuthor | null;
};

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
  page?: number;
  limit?: number;
}
