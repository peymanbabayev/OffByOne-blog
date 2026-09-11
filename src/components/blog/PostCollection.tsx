import type { PostSummary } from "@/types/post";
import PostCard from "./PostCard";
import PostRow from "./PostRow";

interface PostCollectionProps {
  view: "grid" | "index";
  posts: PostSummary[];
}

/**
 * Prezentasiya komponenti — bir yazı siyahısını seçilmiş görünüşdə render edir.
 * Grid və index markup-u YALNIZ burada; `PostArchive` (SSR ilkin + sonsuz-scroll) hər ikisini
 * bu komponentə həvalə edir.
 */
export default function PostCollection({ view, posts }: PostCollectionProps) {
  if (view === "index") {
    return (
      <div className="surface-card divide-y divide-slate-100 px-4 sm:px-5 dark:divide-slate-800">
        {posts.map((post) => (
          <PostRow key={post.slug} post={post} />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-5 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
      {posts.map((post) => (
        <PostCard key={post.slug} post={post} />
      ))}
    </div>
  );
}
