import { getPosts } from "@/lib/posts";
import type { GetPostsOptions } from "@/types/post";
import EmptyState from "@/components/ui/EmptyState";
import PostCard from "./PostCard";

/**
 * Server Component:
 * Prisma vasitəsilə filtr parametrlərinə uyğun postları gətirir.
 * - Əgər nəticə yoxdursa, təkrar istifadə oluna bilən EmptyState göstərir (Early Return).
 * - Nəticə varsa, məqalələrin 3 sütunlu səliqəli qridini render edir.
 */
export default async function PostList(options: GetPostsOptions) {
  const { query, category } = options;
  const posts = await getPosts({ query, category });
  const isFiltered = Boolean(query || (category && category !== "All"));

  // 1. Boş Vəziyyət (Early Return): JSX-i ternary operator ilə yükləmədən təmiz qayıdış
  if (posts.length === 0) {
    return (
      <EmptyState
        icon="🔍"
        title="Axtarışınıza uyğun heç bir məqalə tapılmadı"
        description={
          <>
            &quot;{query || category}&quot; üzrə heç bir qeyd mövcud deyil. Açar sözü dəyişməyə və ya filtrləri sıfırlamağa çalışın.
          </>
        }
        action={{
          label: "Filtrləri sıfırla və bütün yazıları göstər",
          href: "/",
        }}
      />
    );
  }

  // 2. Məqalələr mövcuddursa: Başlıq paneli və 3 sütunlu qrid
  return (
    <section>
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-200/70">
        <div className="flex items-center gap-3">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            {isFiltered ? "Axtarış Nəticələri" : "Son Yazılar"}
          </h2>
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-600">
            {posts.length} məqalə tapıldı
          </span>
        </div>

        {/* Filtr aktivdirsə, hansı meyarlarla axtarıldığı göstərilir */}
        {isFiltered && (
          <div className="text-xs text-slate-500 hidden sm:block">
            {query && <span>Mətn: <strong className="text-slate-800 font-semibold">&quot;{query}&quot;</strong> </span>}
            {category && category !== "All" && <span>Kateqoriya: <strong className="text-slate-800 font-semibold">&quot;{category}&quot;</strong></span>}
          </div>
        )}
      </div>

      {/* Məqalələrin Qridi */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {posts.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>
    </section>
  );
}
