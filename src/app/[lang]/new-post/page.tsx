import type { Metadata } from "next";
import Link from "@/i18n/navigation";
import { requireUser } from "@/lib/auth";
import { createPostAction } from "@/actions/posts";
import PostForm from "@/components/blog/PostForm";
import { getDictionary, getDictionaryFor } from "@/i18n/dictionaries";
import { isLocale, defaultLocale } from "@/i18n/config";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const dict = getDictionaryFor(isLocale(lang) ? lang : defaultLocale);
  return {
    title: dict.meta.newPostTitle,
    description: dict.meta.newPostDescription,
  };
}

export default async function NewPostPage() {
  // Defense-in-depth: əsl qapı `createPostAction` daxilindəki `requireAuth()`-dir.
  const [user, dict] = await Promise.all([
    requireUser("/login?from=/new-post"),
    getDictionary(),
  ]);

  return (
    <div className="max-w-2xl mx-auto py-8 px-4 sm:px-6">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-800 mb-6 transition-colors dark:text-slate-400 dark:hover:text-slate-100"
      >
        <span>←</span>
        <span>{dict.newPost.back}</span>
      </Link>

      <div className="bg-white p-8 sm:p-10 rounded-2xl border border-slate-200/80 shadow-xl shadow-slate-200/30 dark:border-slate-800 dark:bg-slate-900 dark:shadow-none">
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-100 dark:border-blue-500/20 dark:bg-blue-500/10 dark:text-blue-400">
              {dict.newPost.authorBadge.replace("{name}", user.name).replace("{role}", user.role)}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight dark:text-slate-50">
            {dict.newPost.title}
          </h1>
          <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">
            {dict.newPost.subtitle}
          </p>
        </div>

        <PostForm
          action={createPostAction}
          submitLabel={dict.newPost.submit}
          submitLoadingLabel={dict.newPost.submitLoading}
        />
      </div>
    </div>
  );
}
