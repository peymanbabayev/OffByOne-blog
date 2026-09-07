export default function BlogPostLoading() {
  return (
    <div className="max-w-4xl mx-auto animate-pulse">
      {/* Geri qayıt düyməsi skeleton */}
      <div className="h-4 w-36 bg-slate-200 rounded mb-6"></div>

      {/* Məqalə vərəqi skeleton */}
      <div className="bg-white p-8 sm:p-10 rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
        {/* Tarix */}
        <div className="h-4 w-28 bg-slate-200 rounded mb-4"></div>

        {/* Başlıq (2 sətir) */}
        <div className="space-y-3 mb-6">
          <div className="h-8 bg-slate-300 rounded-lg w-4/5"></div>
          <div className="h-8 bg-slate-300 rounded-lg w-3/5"></div>
        </div>

        {/* Excerpt blok */}
        <div className="h-16 bg-slate-100 border-l-2 border-slate-300 rounded-r mb-8"></div>

        {/* Məzmun paraqrafları */}
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <div className="h-4 bg-slate-200 rounded w-full"></div>
          <div className="h-4 bg-slate-200 rounded w-full"></div>
          <div className="h-4 bg-slate-200 rounded w-11/12"></div>
          <div className="h-4 bg-slate-200 rounded w-4/5"></div>
          <div className="h-4 bg-slate-200 rounded w-full"></div>
          <div className="h-4 bg-slate-200 rounded w-3/4"></div>
        </div>
      </div>
    </div>
  );
}
