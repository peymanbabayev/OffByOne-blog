import Link from "next/link";
import { Post } from "@/types/post";
import LikeButton from "./LikeButton";

interface PostCardProps {
  post: Post;
}

/**
 * Server Component:
 * Diqqət: Server Komponentinin daxilində ehtiyac olan yerdə
 * Client Komponenti (<LikeButton />) yerləşdirilə bilər!
 */
export default function PostCard({ post }: PostCardProps) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="block group p-6 rounded-xl bg-white border border-slate-200/70 shadow-[0_1px_3px_rgba(0,0,0,0.05)] hover:shadow-md hover:border-slate-300 transition-all duration-200"
    >
      <article>
        <div className="flex items-center justify-between gap-4 mb-2">
          <h2 className="text-xl font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
            {post.title}
          </h2>
          {post.date && (
            <time className="text-xs font-medium text-slate-400 shrink-0">
              {post.date}
            </time>
          )}
        </div>

        <p className="text-slate-600 text-sm leading-relaxed mb-4">
          {post.excerpt}
        </p>

        <div className="flex items-center justify-between pt-2 border-t border-slate-100/80">
          <div className="flex items-center text-xs font-medium text-blue-600 group-hover:text-blue-700">
            <span>Daha ətraflı oxu</span>
            <span className="ml-1 transition-transform group-hover:translate-x-1">→</span>
          </div>

          {/* Client Komponenti: Yalnız bu kiçik hissə müştəri tərəfdə işləyir */}
          <LikeButton />
        </div>
      </article>
    </Link>
  );
}
