import Link from "@/i18n/navigation";
import Avatar from "@/components/ui/Avatar";
import { formatMonthYear } from "@/i18n/format";
import { getDictionary, getLang } from "@/i18n/dictionaries";

interface AuthorCardProps {
  author?: {
    id?: string;
    name?: string | null;
    email?: string | null;
    role?: "USER" | "ADMIN" | string;
    avatar?: string | null;
    createdAt?: Date | string | null;
    _count?: {
      posts?: number;
    } | null;
  } | null;
}

export default async function AuthorCard({ author }: AuthorCardProps) {
  const [dict, lang] = await Promise.all([getDictionary(), getLang()]);
  const authorName = author?.name || dict.post.defaultAuthorName;

  const authorJoinedDate = author?.createdAt
    ? formatMonthYear(author.createdAt, lang)
    : null;

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.05)] dark:border-slate-800 dark:bg-slate-900 dark:shadow-none">
      <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 block mb-3 dark:text-blue-400">
        {dict.sidebar.authorOfPost}
      </span>

      <div className="flex items-start gap-3.5 mb-4">
        <Avatar
          src={author?.avatar}
          name={authorName}
          className="h-12 w-12 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 text-lg font-black text-white shadow-sm"
          imgSizes="48px"
        />

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-bold text-slate-900 text-sm truncate dark:text-slate-50">
              {authorName}
            </h3>
            {author?.role === "ADMIN" ? (
              <span className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 font-bold text-[9px] tracking-wide dark:bg-amber-500/15 dark:text-amber-400">
                {dict.post.adminBadge}
              </span>
            ) : (
              <span className="px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 font-medium text-[9px] dark:bg-blue-500/15 dark:text-blue-400">
                {dict.post.authorBadge}
              </span>
            )}
          </div>

          <p className="text-xs text-slate-400 truncate mt-0.5 dark:text-slate-500">
            {author?.email || dict.post.defaultAuthorEmail}
          </p>
        </div>
      </div>

      {/* Müəllif Statistikası */}
      <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-100 text-center dark:border-slate-800">
        <div className="p-2 rounded-xl bg-slate-50 border border-slate-100/80 dark:border-slate-800 dark:bg-slate-800/60">
          <span className="block text-xs font-bold text-slate-900 dark:text-slate-50">
            {author?._count?.posts ?? 1}
          </span>
          <span className="text-[10px] text-slate-500 font-medium dark:text-slate-400">{dict.sidebar.sharedPosts}</span>
        </div>
        <div className="p-2 rounded-xl bg-slate-50 border border-slate-100/80 dark:border-slate-800 dark:bg-slate-800/60">
          <span className="block text-xs font-bold text-slate-900 dark:text-slate-50">
            {authorJoinedDate || dict.sidebar.activeMember}
          </span>
          <span className="text-[10px] text-slate-500 font-medium dark:text-slate-400">{dict.sidebar.memberSince}</span>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
        <Link
          href={`/?q=${encodeURIComponent(authorName)}`}
          className="text-xs font-semibold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1 transition-colors dark:text-blue-400 dark:hover:text-blue-300"
        >
          <span>{dict.sidebar.findMoreByAuthor}</span>
          <span>→</span>
        </Link>
      </div>
    </div>
  );
}
