import { cache } from "react";
import { Post } from "@/types/post";

const posts: Post[] = [
  {
    slug: "ilk-yazi",
    title: "İlk yazım",
    excerpt: "Bu, blogumun ilk yazısıdır.",
    content: "İlk yazımın ətraflı məzmunu burada olacaq. Next.js ilə öyrənmə yolumuz davam edir! Bu məzmun dinamik səhifədə birbaşa göstərilir.",
    date: "2025-05-10",
  },
  {
    slug: "nextjs-oyrenirem",
    title: "Next.js öyrənirəm",
    excerpt: "Server Components maraqlıdır.",
    content: "Next.js App Router-də Server Components default olaraq gəlir. Bu həm sürətli yüklənmə, həm də SEO üçün çox əlverişlidir. Dinamik marşrutlar (slugs) vasitəsilə isə istənilən məqaləni unikal URL ilə oxuculara çatdırırıq.",
    date: "2025-05-12",
  },
];

/**
 * Bütün postları gətirən köməkçi funksiya.
 */
export async function getPosts(): Promise<Post[]> {
  console.log("db sorğusu edildi: all posts");
  return posts;
}

/**
 * React cache() ilə sarılmış funksiya:
 * Eyni render dövründə (Request Lifecycle) bu funksiya eyni slug parametri ilə
 * bir neçə dəfə (məsələn, həm generateMetadata-da, həm də BlogPostPage-də) çağırılsa belə,
 * funksiyanın gövdəsi YALNIZ 1 DƏFƏ icra olunur (Request Deduplication).
 */
export const getPostBySlug = cache(async (slug: string): Promise<Post | undefined> => {
  console.log("🔥 [DB SORĞUSU İCRA OLUNDU] -> slug:", slug);
  return posts.find((post) => post.slug === slug);
});
