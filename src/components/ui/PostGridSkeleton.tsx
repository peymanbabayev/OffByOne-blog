import PostCardSkeleton from "./PostCardSkeleton";

export default function PostGridSkeleton() {
  return (
    <section aria-hidden>
      <div className="mb-5 flex items-center justify-between border-b border-slate-200 pb-3">
        <div className="h-5 w-32 animate-pulse rounded bg-slate-200" />
        <div className="h-7 w-28 animate-pulse rounded-lg bg-slate-100" />
      </div>

      <div className="grid grid-cols-1 gap-5 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <PostCardSkeleton key={index} />
        ))}
      </div>
    </section>
  );
}
