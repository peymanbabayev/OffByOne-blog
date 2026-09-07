import PostGridSkeleton from "@/components/ui/PostGridSkeleton";

export default function Loading() {
  return (
    <main className="max-w-7xl mx-auto py-10 sm:py-14 px-4 sm:px-6 lg:px-8">
      {/* Axtarış və Filtr Paneli Skeleton */}
      <div className="mb-10 space-y-5 bg-white p-6 sm:p-7 rounded-2xl border border-slate-200/80 shadow-[0_2px_10px_rgba(0,0,0,0.03)] animate-pulse">
        <div className="h-11 bg-slate-100 rounded-xl w-full"></div>
        <div className="flex flex-wrap gap-2 pt-1">
          <div className="h-7 w-12 bg-slate-200 rounded-lg"></div>
          <div className="h-7 w-16 bg-slate-100 rounded-lg"></div>
          <div className="h-7 w-20 bg-slate-100 rounded-lg"></div>
          <div className="h-7 w-16 bg-slate-100 rounded-lg"></div>
          <div className="h-7 w-24 bg-slate-100 rounded-lg"></div>
        </div>
      </div>

      {/* Məqalələr Qridi Skeleton */}
      <PostGridSkeleton />
    </main>
  );
}
