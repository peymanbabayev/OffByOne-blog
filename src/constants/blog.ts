/**
 * Bloq üçün dəstəklənən kateqoriyaların vahid siyahısı.
 * 'as const' TypeScript-ə bildirir ki, bu massiv sabitdir və elementlərinin tipləri dəqiq müəyyəndir.
 */
export const BLOG_CATEGORIES = [
  "All",
  "Next.js",
  "React",
  "TypeScript",
  "Database",
  "DevOps",
  "Performance",
  "Best Practices",
  "Mühəndislik",
] as const;

export type BlogCategory = (typeof BLOG_CATEGORIES)[number];

/**
 * Bloq və müəllif haqqında sabit konfiqurasiya məlumatları.
 */
export const BLOG_CONFIG = {
  title: "Mənim Bloqum",
  description: "Next.js 16, Prisma, PostgreSQL və müasir proqramlaşdırma haqqında dərin qeydlər",
  author: {
    name: "Peyman Babayev",
    role: "Full-Stack Mühəndis",
    bio: "Müasir veb texnologiyaları, Next.js ekosistemi və sistem arxitekturası haqqında qeydlər paylaşıram.",
    avatarInitials: "PB",
  },
  popularTags: ["#nextjs", "#react", "#typescript", "#prisma", "#postgresql", "#architecture"],
} as const;
