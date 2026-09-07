export default function PostCardSkeleton() {
  return (
    <div className="flex flex-col justify-between bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-7 shadow-[0_2px_8px_rgba(0,0,0,0.04)] animate-pulse">
      <div>
        {/* Kateqoriya və Tarix Skeleton */}
        <div className="flex items-center justify-between gap-2 mb-4">
          <div className="h-5 w-20 bg-slate-200 rounded-full"></div>
          <div className="h-4 w-20 bg-slate-100 rounded"></div>
        </div>

        {/* Başlıq (2 sətir) */}
        <div className="space-y-2.5 mt-2">
          <div className="h-5 bg-slate-200 rounded w-5/6"></div>
          <div className="h-5 bg-slate-200 rounded w-3/4"></div>
        </div>

        {/* Qısa Məzmun (Excerpt - 3 sətir) */}
        <div className="space-y-2 mt-4">
          <div className="h-3.5 bg-slate-100 rounded w-full"></div>
          <div className="h-3.5 bg-slate-100 rounded w-full"></div>
          <div className="h-3.5 bg-slate-100 rounded w-2/3"></div>
        </div>
      </div>

      {/* Alt hissə (Link və Like düyməsi) */}
      <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
        <div className="h-4 w-24 bg-slate-200 rounded"></div>
        <div className="h-7 w-12 bg-slate-100 rounded-full"></div>
      </div>
    </div>
  );
}
