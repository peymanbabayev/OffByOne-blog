import type { Post as PrismaPost } from "@prisma/client";

export interface PostAuthor {
  id: string;
  name: string;
  email: string;
  role: "USER" | "ADMIN";
  avatar?: string | null;
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
 * Ana səhifə hero-sundakı "Seçilmiş yazı" — yığcam sahələr + hesablanmış oxuma müddəti.
 * `content` daşınmır (payload yüngül qalır), yalnız `readingMinutes` çıxarılır.
 */
export type FeaturedPost = PostSummary & {
  readingMinutes: number;
};

/**
 * Postları bazadan gətirərkən qəbul edilən axtarış və filtr parametrləri.
 */
export interface GetPostsOptions {
  query?: string;
  category?: string;
  page?: number;
  limit?: number;
  /** Nəticədən kənarda saxlanılacaq post id-si (məs. hero-dakı seçilmiş yazı siyahıda təkrarlanmasın). */
  excludeId?: string;
}
