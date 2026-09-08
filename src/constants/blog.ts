/**
 * Yeni məqalə üçün seçilə bilən kateqoriyalar (filtr "All" olmadan).
 * Həm `NewPostForm`-un `<select>`-i, həm də `createPostSchema` bu siyahıdan qidalanır.
 * 'as const' elementlərin dəqiq literal tiplərini qoruyur.
 */
export const POST_CATEGORIES = [
  "Next.js",
  "React",
  "TypeScript",
  "Database",
  "DevOps",
  "Performance",
  "Best Practices",
  "Mühəndislik",
] as const;

export type PostCategory = (typeof POST_CATEGORIES)[number];

/**
 * Bloq filtrində göstərilən bütün kateqoriyalar — "All" + məqalə kateqoriyaları.
 */
export const BLOG_CATEGORIES = ["All", ...POST_CATEGORIES] as const;

export type BlogCategory = (typeof BLOG_CATEGORIES)[number];

/**
 * Bir səhifədə və hər scroll zamanı yüklənən məqalələrin sayı.
 * Mərkəzləşdirilib ki, PostList və InfiniteScroll-da riyaziyyat həmişə 100% sinxron olsun.
 */
export const POSTS_PER_PAGE = 6;

/**
 * Bloq və müəllif haqqında sabit konfiqurasiya məlumatları.
 */
export const BLOG_CONFIG = {
  title: "OffByOne",
  description: "Kompüter elmləri, paylanmış sistemlər, Next.js və müasir proqramlaşdırma haqqında dərin qeydlər",
  author: {
    name: "Peyman Babayev",
    role: "Full-Stack Mühəndis",
    bio: "Müasir veb texnologiyaları, Next.js ekosistemi və sistem arxitekturası haqqında qeydlər paylaşıram.",
    avatarInitials: "PB",
  },
  popularTags: ["#nextjs", "#react", "#typescript", "#prisma", "#postgresql", "#architecture"],
} as const;
