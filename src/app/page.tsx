import type { Metadata } from "next";
import { getPosts } from "@/lib/posts";
import PostCard from "@/components/PostCard";

export const metadata: Metadata = {
  title: "Mənim Bloqum",
  description: "Next.js və proqramlaşdırma haqqında qeydlər",
};

/**
 * Server Component:
 * Navbar artıq RootLayout tərəfindən idarə olunur.
 * Səhifə yalnız özünə aid məzmunu render edir.
 */
export default async function HomePage() {
  const posts = await getPosts();

  return (
    <main className="max-w-3xl mx-auto py-12 px-6">
      <section className="mb-10">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight sm:text-4xl">
          Məqalələr & Qeydlər
        </h1>
        <p className="mt-2 text-base text-slate-600">
          Next.js, Full-Stack inkişaf və gündəlik proqramlaşdırma təcrübələrim.
        </p>
      </section>

      <section className="space-y-4">
        {posts.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </section>
    </main>
  );
}
