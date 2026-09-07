import type { Metadata } from "next";
import { requireUser } from "@/lib/auth";
import Link from "next/link";
import NewPostForm from "./NewPostForm";

export const metadata: Metadata = {
  title: "Yeni Məqalə Yaz | Mənim Bloqum",
  description: "Öz bilik və təcrübələrinizi yeni məqalə kimi paylaşın.",
};

export default async function NewPostPage() {
  // Defense-in-depth: əsl qapı `createPostAction` daxilindəki `requireAuth()`-dir.
  const user = await requireUser("/login?from=/new-post");

  return (
    <div className="max-w-2xl mx-auto py-8 px-4 sm:px-6">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-800 mb-6 transition-colors"
      >
        <span>←</span>
        <span>Ana səhifəyə qayıt</span>
      </Link>

      <div className="bg-white p-8 sm:p-10 rounded-2xl border border-slate-200/80 shadow-xl shadow-slate-200/30">
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-100">
              Müəllif: {user.name} ({user.role})
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Yeni Məqalə Dərc Edin
          </h1>
          <p className="mt-1.5 text-sm text-slate-500">
            Aşağıdakı sahələri dolduraraq bloqunuza yeni yazı əlavə edin.
          </p>
        </div>

        <NewPostForm />
      </div>
    </div>
  );
}
