/**
 * `HomeHero` üçün Suspense fallback-i — eyni ölçü və boşluqlarla, layout shift olmadan.
 */
export default function HomeHeroSkeleton() {
  return (
    <section className="mb-10" aria-hidden>
      <div className="surface-card animate-pulse p-6 sm:p-8">
        <div className="mb-5 h-3 w-24 rounded bg-slate-200" />
        <div className="space-y-2.5">
          <div className="h-7 w-3/4 rounded bg-slate-200" />
          <div className="h-7 w-1/2 rounded bg-slate-200" />
        </div>
        <div className="mt-4 space-y-2">
          <div className="h-3.5 w-full rounded bg-slate-100" />
          <div className="h-3.5 w-2/3 rounded bg-slate-100" />
        </div>
        <div className="mt-6 flex gap-3">
          <div className="h-5 w-20 rounded-full bg-slate-100" />
          <div className="h-5 w-24 rounded bg-slate-100" />
        </div>
      </div>
    </section>
  );
}
