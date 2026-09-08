import Link from "next/link";

interface AuthorCardProps {
  author?: {
    id?: string;
    name?: string | null;
    email?: string | null;
    role?: "USER" | "ADMIN" | string;
    createdAt?: Date | string | null;
    _count?: {
      posts?: number;
    } | null;
  } | null;
}

export default function AuthorCard({ author }: AuthorCardProps) {
  const authorName = author?.name || "Peyman Babayev";
  const authorInitial = authorName.charAt(0).toUpperCase();

  const authorJoinedDate = author?.createdAt
    ? new Date(author.createdAt).toLocaleDateString("az-AZ", {
        month: "short",
        year: "numeric",
      })
    : null;

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
      <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 block mb-3">
        Məqalənin Müəllifi
      </span>

      <div className="flex items-start gap-3.5 mb-4">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 text-white font-black text-lg flex items-center justify-center shadow-sm shrink-0">
          {authorInitial}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-bold text-slate-900 text-sm truncate">
              {authorName}
            </h3>
            {author?.role === "ADMIN" ? (
              <span className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 font-bold text-[9px] tracking-wide">
                ADMIN
              </span>
            ) : (
              <span className="px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 font-medium text-[9px]">
                Müəllif
              </span>
            )}
          </div>

          <p className="text-xs text-slate-400 truncate mt-0.5">
            {author?.email || "peyman@example.com"}
          </p>
        </div>
      </div>

      {/* Müəllif Statistikası */}
      <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-100 text-center">
        <div className="p-2 rounded-xl bg-slate-50 border border-slate-100/80">
          <span className="block text-xs font-bold text-slate-900">
            {author?._count?.posts ?? 1}
          </span>
          <span className="text-[10px] text-slate-500 font-medium">Paylaşılan Məqalə</span>
        </div>
        <div className="p-2 rounded-xl bg-slate-50 border border-slate-100/80">
          <span className="block text-xs font-bold text-slate-900">
            {authorJoinedDate || "Fəal Üzv"}
          </span>
          <span className="text-[10px] text-slate-500 font-medium">Üzvlük Tarixi</span>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100">
        <Link
          href={`/?q=${encodeURIComponent(authorName)}`}
          className="text-xs font-semibold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1 transition-colors"
        >
          <span>Müəllifin digər yazılarını axtar</span>
          <span>→</span>
        </Link>
      </div>
    </div>
  );
}
