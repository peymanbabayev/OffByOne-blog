import { estimateReadingTime } from "@/lib/reading-time";

interface ReadingStatsCardProps {
  content?: string;
  category?: string;
}

export default function ReadingStatsCard({
  content = "",
  category = "Mühəndislik",
}: ReadingStatsCardProps) {
  const wordCount = content ? content.trim().split(/\s+/).filter(Boolean).length : 0;
  const readingTime = estimateReadingTime(content);

  return (
    <div className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white p-5 rounded-2xl shadow-sm border border-slate-800">
      <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400 block mb-3">
        Məqalə İcmalı
      </span>
      <div className="space-y-2.5 text-xs text-slate-300">
        <div className="flex items-center justify-between py-1 border-b border-white/10">
          <span className="text-slate-400 flex items-center gap-1.5">
            <span>⏱️</span>
            <span>Oxuma müddəti:</span>
          </span>
          <span className="font-bold text-white">~{readingTime} dəqiqə</span>
        </div>
        <div className="flex items-center justify-between py-1 border-b border-white/10">
          <span className="text-slate-400 flex items-center gap-1.5">
            <span>🏷️</span>
            <span>Kateqoriya:</span>
          </span>
          <span className="font-bold text-blue-300 bg-blue-500/20 px-2 py-0.5 rounded">
            {category}
          </span>
        </div>
        <div className="flex items-center justify-between py-1">
          <span className="text-slate-400 flex items-center gap-1.5">
            <span>📝</span>
            <span>Söz sayı:</span>
          </span>
          <span className="font-bold text-white">{wordCount} söz</span>
        </div>
      </div>
    </div>
  );
}
