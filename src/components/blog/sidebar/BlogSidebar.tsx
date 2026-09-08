import AuthorCard from "./AuthorCard";
import ReadingStatsCard from "./ReadingStatsCard";
import CategoryTags from "./CategoryTags";
import CommunityCard from "./CommunityCard";

interface BlogSidebarProps {
  post: {
    category?: string;
    content?: string;
    author?: {
      id?: string;
      name?: string | null;
      email?: string | null;
      role?: string;
      createdAt?: Date | string | null;
      _count?: {
        posts?: number;
      } | null;
    } | null;
  };
}

export default function BlogSidebar({ post }: BlogSidebarProps) {
  return (
    <aside className="space-y-6">
      {/* 1. Müəllif Profili */}
      <AuthorCard author={post.author} />

      {/* 2. Mütaliə Göstəriciləri */}
      <ReadingStatsCard content={post.content} category={post.category} />

      {/* 3. Mövzular və Teqlər */}
      <CategoryTags currentCategory={post.category} />

      {/* 4. İcma Çağırış Kartı */}
      <CommunityCard />
    </aside>
  );
}
