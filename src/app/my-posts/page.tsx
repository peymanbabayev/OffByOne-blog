import type { Metadata } from "next";
import Link from "next/link";
import { requireUser } from "@/lib/auth";
import { getUserPosts } from "@/lib/posts";
import { formatAzDate } from "@/lib/format";
import DeletePostButton from "@/components/blog/DeletePostButton";
import EmptyState from "@/components/ui/EmptyState";

export const metadata: Metadata = {
  title: "Məqalələrim | OffByOne",
  description: "Müəllifi olduğunuz bütün mühəndislik yazılarını idarə edin.",
};

export default async function MyPostsPage() {
  const user = await requireUser("/login?from=/my-posts");
  const posts = await getUserPosts(user.id);

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
      {/* Yuxarı Başlıq və Naviqasiya */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-accent mb-1.5">
            <span>Müəllif Paneli</span>
            <span>&bull;</span>
            <span>{user.name}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Məqalələrim
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-500">
            Dərc etdiyiniz bütün mühəndislik yazılarını buradan idarə edə, redaktə edə və ya silə bilərsiniz.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Link
            href="/new-post"
            className="inline-flex items-center gap-2 rounded-xl bg-accent px-4 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-sm transition-colors hover:bg-accent-hover"
          >
            <span aria-hidden="true">+</span>
            <span>Yeni Məqalə Yaz</span>
          </Link>
        </div>
      </div>

      {/* Statistik Vurğu Kartları */}
      <div className="mb-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
          <span className="text-xs font-medium text-slate-500 block mb-1">
            Ümumi Yazılarım
          </span>
          <span className="text-2xl font-black text-slate-900">
            {posts.length}
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
          <span className="text-xs font-medium text-slate-500 block mb-1">
            Müəllif Statusu
          </span>
          <span className="text-sm font-bold text-slate-800 flex items-center gap-1.5 mt-1">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            {user.role === "ADMIN" ? "Sistem Administratoru" : "Müəllif"}
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
          <span className="text-xs font-medium text-slate-500 block mb-1">
            Hesab E-poçtu
          </span>
          <span className="text-xs font-semibold text-slate-700 truncate block mt-1">
            {user.email}
          </span>
        </div>
      </div>

      {/* Məqalələr Siyahısı */}
      {posts.length === 0 ? (
        <EmptyState
          title="Hələ heç bir məqaləniz yoxdur"
          description="OffByOne platformasında ilk mühəndislik qeydinizi yazaraq proqramlaşdırma təcrübənizi paylaşın."
          action={{ label: "İlk məqaləni yaz", href: "/new-post" }}
        />
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="divide-y divide-slate-100">
            {posts.map((post) => {
              const date = formatAzDate(post.createdAt);
              const readUrl = `/blog/${post.slug}`;
              const editUrl = `/edit-post/${post.slug}`;

              return (
                <div
                  key={post.id}
                  className="p-5 sm:p-6 transition-colors hover:bg-slate-50/70 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-100 px-2.5 py-0.5 text-[11px] font-medium text-slate-700">
                        {post.category}
                      </span>
                      <time className="text-xs text-slate-400">{date}</time>
                      <span className="text-slate-300">&bull;</span>
                      <span className="text-xs text-slate-400">
                        {post.readingMinutes} dəq oxuma
                      </span>
                    </div>

                    <Link
                      href={readUrl}
                      className="group block"
                    >
                      <h2 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-accent transition-colors line-clamp-1">
                        {post.title}
                      </h2>
                    </Link>

                    <p className="mt-1 text-xs sm:text-sm text-slate-500 line-clamp-2">
                      {post.excerpt}
                    </p>
                  </div>

                  {/* Əməliyyat Düymələri */}
                  <div className="flex items-center gap-2 self-end sm:self-center shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 w-full sm:w-auto justify-end">
                    <Link
                      href={readUrl}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                      title="Məqaləni oxu"
                    >
                      <svg
                        className="h-3.5 w-3.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                      <span>Bax</span>
                    </Link>

                    <Link
                      href={editUrl}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-accent hover:text-accent-hover bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                      title="Məqaləni redaktə et"
                    >
                      <svg
                        className="h-3.5 w-3.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                      <span>Redaktə</span>
                    </Link>

                    <DeletePostButton
                      postId={post.id}
                      redirectTo="/my-posts"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </main>
  );
}
