import type { Metadata } from "next";
import { Suspense } from "react";
import SearchAndFilter from "@/components/blog/SearchAndFilter";
import PostList from "@/components/blog/PostList";
import PostGridSkeleton from "@/components/ui/PostGridSkeleton";

export const metadata: Metadata = {
  title: "Mənim Bloqum | Next.js & Full-Stack Qeydlər",
  description: "Next.js 16, Prisma, PostgreSQL və müasir proqramlaşdırma haqqında dərin qeydlər",
};

interface HomePageProps {
  searchParams: Promise<{
    q?: string;
    category?: string;
  }>;
}

/**
 * Server Component:
 * URL-dəki asinxron searchParams-ı oxuyur, axtarış və filtr panelini dərhal render edir.
 * Məqalələr siyahısını isə React Suspense ilə əhatə edir ki, axtarış və ya kateqoriya
 * dəyişərkən istifadəçiyə dərhal zərif Skeleton yüklənmə animasiyası təqdim olunsun.
 */
export default async function HomePage({ searchParams }: HomePageProps) {
  const { q, category } = await searchParams;

  return (
    <main className="max-w-7xl mx-auto py-10 sm:py-14 px-4 sm:px-6 lg:px-8">
      {/* Axtarış və Kateqoriya Filtr Paneli (Client Component - Debounce dəstəkli) */}
      <SearchAndFilter />

      {/* Məqalələrin Siyahısı (React 19 & Next.js Streaming Suspense) */}
      <Suspense
        key={`${q ?? ""}-${category ?? ""}`}
        fallback={<PostGridSkeleton />}
      >
        <PostList query={q} category={category} />
      </Suspense>
    </main>
  );
}
