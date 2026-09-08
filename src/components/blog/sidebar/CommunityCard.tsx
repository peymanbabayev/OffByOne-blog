import Link from "next/link";

export default function CommunityCard() {
  return (
    <div className="p-6 rounded-2xl bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 border border-blue-100 text-slate-800 relative overflow-hidden">
      <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-lg mb-3 shadow-sm">
        ✍️
      </div>
      <h4 className="text-sm font-bold text-slate-900 mb-1">
        Sən də Öz Məqaləni Paylaş!
      </h4>
      <p className="text-xs text-slate-600 leading-relaxed mb-4">
        Öz texniki təcrübəni və biliklərini yüzlərlə oxucu ilə bölüşmək istəyirsən? İcmanın bir hissəsi ol!
      </p>
      <Link
        href="/new-post"
        className="inline-flex items-center justify-center w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm transition-all text-center gap-1.5"
      >
        <span>Yeni Məqalə Yaz</span>
        <span>→</span>
      </Link>
    </div>
  );
}
