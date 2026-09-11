export default function PostCardSkeleton() {
  return (
    <div className="surface-card flex animate-pulse flex-col p-5 sm:p-6">
      <div className="flex items-center gap-2">
        <div className="h-4 w-16 rounded-full bg-slate-200 dark:bg-slate-800" />
        <div className="h-3 w-16 rounded bg-slate-100 dark:bg-slate-800/60" />
      </div>

      <div className="mt-3 space-y-2">
        <div className="h-4 w-5/6 rounded bg-slate-200 dark:bg-slate-800" />
        <div className="h-4 w-2/3 rounded bg-slate-200 dark:bg-slate-800" />
      </div>

      <div className="mt-3 space-y-1.5">
        <div className="h-3 w-full rounded bg-slate-100 dark:bg-slate-800/60" />
        <div className="h-3 w-4/5 rounded bg-slate-100 dark:bg-slate-800/60" />
      </div>

      <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4 dark:border-slate-800">
        <div className="h-3 w-20 rounded bg-slate-100 dark:bg-slate-800/60" />
        <div className="h-3 w-10 rounded bg-slate-100 dark:bg-slate-800/60" />
      </div>
    </div>
  );
}
