import type { Metadata } from "next";
import Link from "@/i18n/navigation";
import { notFound } from "next/navigation";
import { getPostBySlug } from "@/lib/posts";
import { requireUser } from "@/lib/auth";
import { canManagePost } from "@/lib/permissions";
import { updatePostAction } from "@/actions/posts";
import PostForm from "@/components/blog/PostForm";
import { getDictionary, getDictionaryFor } from "@/i18n/dictionaries";
import { isLocale, defaultLocale } from "@/i18n/config";
import { redirectWithLocale } from "@/i18n/redirect";

interface EditPostPageProps {
  params: Promise<{ lang: string; slug: string }>;
}

export async function generateMetadata({ params }: EditPostPageProps): Promise<Metadata> {
  const { lang, slug } = await params;
  const dict = getDictionaryFor(isLocale(lang) ? lang : defaultLocale);
  const post = await getPostBySlug(slug);
  return {
    title: post ? `${dict.meta.editPostTitlePrefix}: ${post.title}` : dict.meta.postNotFound,
  };
}

export default async function EditPostPage({ params }: EditPostPageProps) {
  const { slug } = await params;

  // Defense-in-depth: əsl qapı `updatePostAction` daxilindəki yoxlamalardır.
  const [user, dict] = await Promise.all([
    requireUser(`/login?from=/edit-post/${slug}`),
    getDictionary(),
  ]);
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  if (!canManagePost(user, post)) {
    // İcazə yoxdursa məqalənin özünə qaytarırıq
    await redirectWithLocale(`/blog/${slug}`);
  }

  return (
    <div className="max-w-2xl mx-auto py-8 px-4 sm:px-6">
      <Link
        href={`/blog/${slug}`}
        className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-800 mb-6 transition-colors dark:text-slate-400 dark:hover:text-slate-100"
      >
        <span>←</span>
        <span>{dict.editPost.back}</span>
      </Link>

      <div className="bg-white p-8 sm:p-10 rounded-2xl border border-slate-200/80 shadow-xl shadow-slate-200/30 dark:border-slate-800 dark:bg-slate-900 dark:shadow-none">
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-100 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-400">
              {dict.editPost.modeBadge}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight dark:text-slate-50">
            {dict.editPost.title}
          </h1>
          <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">
            {dict.editPost.subtitle}
          </p>
        </div>

        <PostForm
          action={updatePostAction.bind(null, post.id)}
          submitLabel={dict.editPost.submit}
          submitLoadingLabel={dict.editPost.submitLoading}
          currentSlug={post.slug}
          initialValues={{
            title: post.title,
            category: post.category,
            excerpt: post.excerpt,
            content: post.content,
            coverImage: post.coverImage ?? undefined,
          }}
        />
      </div>
    </div>
  );
}
