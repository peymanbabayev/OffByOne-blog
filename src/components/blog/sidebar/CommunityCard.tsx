import Link from "@/i18n/navigation";
import { getDictionary } from "@/i18n/dictionaries";

export default async function CommunityCard() {
  const dict = await getDictionary();

  return (
    <div className="p-6 rounded-2xl bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 border border-blue-100 text-slate-800 relative overflow-hidden dark:border-blue-500/20 dark:from-blue-500/10 dark:via-indigo-500/10 dark:to-purple-500/10 dark:text-slate-100">
      <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-lg mb-3 shadow-sm">
        ✍️
      </div>
      <h4 className="text-sm font-bold text-slate-900 mb-1 dark:text-slate-50">
        {dict.sidebar.communityTitle}
      </h4>
      <p className="text-xs text-slate-600 leading-relaxed mb-4 dark:text-slate-400">
        {dict.sidebar.communityDesc}
      </p>
      <Link
        href="/new-post"
        className="inline-flex items-center justify-center w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm transition-all text-center gap-1.5"
      >
        <span>{dict.sidebar.communityCta}</span>
        <span>→</span>
      </Link>
    </div>
  );
}
