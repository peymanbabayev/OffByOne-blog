import Link from "next/link";
import LikeButton from "./LikeButton";

// Prisma-dan gələn model tipi
interface PostItem {
  slug: string;
  title: string;
  excerpt: string;
  createdAt: Date;
}

interface PostCardProps {
  post: PostItem;
}

export default function PostCard({ post }: PostCardProps) {
  const formattedDate = new Date(post.createdAt).toLocaleDateString("az-AZ", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  // Başlıq və ya slug-a uyğun avtomatik kateqoriya etiketi
  const getCategory = (slug: string) => {
    if (slug.includes("nextjs") || slug.includes("server-actions")) return "Next.js";
    if (slug.includes("react") || slug.includes("state")) return "React";
    if (slug.includes("typescript")) return "TypeScript";
    if (slug.includes("prisma") || slug.includes("sql") || slug.includes("postgresql")) return "Database";
    if (slug.includes("docker") || slug.includes("ci-cd")) return "DevOps";
    if (slug.includes("clean-code") || slug.includes("git")) return "Best Practices";
    if (slug.includes("performance") || slug.includes("web")) return "Performance";
    return "Mühəndislik";
  };

  const category = getCategory(post.slug);

  return (
    <div className="group relative flex flex-col justify-between bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-7 shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-xl hover:border-blue-200 hover:-translate-y-1.5 transition-all duration-300">
      <div>
        <div className="flex items-center justify-between gap-2 mb-3.5">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-100/80">
            {category}
          </span>
          <time className="text-xs font-medium text-slate-400">
            {formattedDate}
          </time>
        </div>

        <Link href={`/blog/${post.slug}`} className="block focus:outline-none">
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2 leading-snug">
            {post.title}
          </h2>
          <p className="mt-2.5 text-sm text-slate-600 leading-relaxed line-clamp-3">
            {post.excerpt}
          </p>
        </Link>
      </div>

      <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
        <Link
          href={`/blog/${post.slug}`}
          className="inline-flex items-center text-xs font-semibold text-blue-600 group-hover:text-blue-700 transition-colors"
        >
          <span>Oxumağa başla</span>
          <span className="ml-1 transition-transform duration-200 group-hover:translate-x-1">→</span>
        </Link>

        <LikeButton />
      </div>
    </div>
  );
}
