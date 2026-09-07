import PostCardSkeleton from "./PostCardSkeleton";

export default function PostGridSkeleton() {
  return (
    <section>
      {/* Başlıq və Sayğac Skeleton */}
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-200/70">
        <div className="flex items-center gap-3">
          <div className="h-7 w-36 bg-slate-200 rounded-lg animate-pulse"></div>
          <div className="h-5 w-24 bg-slate-100 rounded-full animate-pulse"></div>
        </div>
      </div>

      {/* 6 Ədəd Post Kartı Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {Array.from({ length: 6 }).map((_, index) => (
          <PostCardSkeleton key={index} />
        ))}
      </div>
    </section>
  );
}
