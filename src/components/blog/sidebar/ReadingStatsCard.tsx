import { estimateReadingTime } from "@/lib/reading-time";
import { getDictionary } from "@/i18n/dictionaries";

interface ReadingStatsCardProps {
  content?: string;
  category?: string;
}

export default async function ReadingStatsCard({
  content = "",
  category = "Mühəndislik",
}: ReadingStatsCardProps) {
  const dict = await getDictionary();
  const wordCount = content ? content.trim().split(/\s+/).filter(Boolean).length : 0;
  const readingTime = estimateReadingTime(content);

  return (
    <div className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white p-5 rounded-2xl shadow-sm border border-slate-800">
      <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400 block mb-3">
        {dict.sidebar.articleOverview}
      </span>
      <div className="space-y-2.5 text-xs text-slate-300">
        <div className="flex items-center justify-between py-1 border-b border-white/10">
          <span className="text-slate-400 flex items-center gap-1.5">
            <span>⏱️</span>
            <span>{dict.sidebar.readingTime}</span>
          </span>
          <span className="font-bold text-white">~{readingTime} {dict.sidebar.readingTimeUnit}</span>
        </div>
        <div className="flex items-center justify-between py-1 border-b border-white/10">
          <span className="text-slate-400 flex items-center gap-1.5">
            <span>🏷️</span>
            <span>{dict.sidebar.category}</span>
          </span>
          <span className="font-bold text-blue-300 bg-blue-500/20 px-2 py-0.5 rounded">
            {category}
          </span>
        </div>
        <div className="flex items-center justify-between py-1">
          <span className="text-slate-400 flex items-center gap-1.5">
            <span>📝</span>
            <span>{dict.sidebar.wordCount}</span>
          </span>
          <span className="font-bold text-white">{wordCount} {dict.sidebar.wordCountUnit}</span>
        </div>
      </div>
    </div>
  );
}
