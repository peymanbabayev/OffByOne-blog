import Link from "next/link";
import { POST_CATEGORIES } from "@/constants/blog";

interface CategoryTagsProps {
  currentCategory?: string;
}

export default function CategoryTags({ currentCategory }: CategoryTagsProps) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-bold text-slate-900 text-sm">Mövzular və Teqlər</h3>
        <Link
          href="/"
          className="text-[11px] font-semibold text-blue-600 hover:text-blue-700"
        >
          Hamısı
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
                  : "bg-slate-100 text-slate-600 hover:bg-blue-50 hover:text-blue-600"
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
