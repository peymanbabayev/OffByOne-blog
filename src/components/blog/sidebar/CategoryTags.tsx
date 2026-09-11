import Link from "@/i18n/navigation";
import { POST_CATEGORIES } from "@/constants/blog";
import { getDictionary } from "@/i18n/dictionaries";

interface CategoryTagsProps {
  currentCategory?: string;
}

export default async function CategoryTags({ currentCategory }: CategoryTagsProps) {
  const dict = await getDictionary();

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.05)] dark:border-slate-800 dark:bg-slate-900 dark:shadow-none">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-bold text-slate-900 text-sm dark:text-slate-50">{dict.sidebar.topicsAndTags}</h3>
        <Link
          href="/"
          className="text-[11px] font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
        >
          {dict.sidebar.all}
        </Link>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {POST_CATEGORIES.map((cat) => {
          const isCurrent = currentCategory === cat;
          return (
            <Link
              key={cat}
              href={`/?category=${encodeURIComponent(cat)}`}
              className={`text-xs px-3 py-1.5 rounded-xl font-medium transition-all ${
                isCurrent
                  ? "bg-blue-600 text-white shadow-sm font-semibold"
                  : "bg-slate-100 text-slate-600 hover:bg-blue-50 hover:text-blue-600 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-blue-500/10 dark:hover:text-blue-400"
              }`}
            >
              {cat}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
