import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getPostBySlug } from "@/lib/posts";
import { requireUser } from "@/lib/auth";
import { canManagePost } from "@/lib/permissions";
import { updatePostAction } from "@/actions/posts";
import PostForm from "@/components/blog/PostForm";

interface EditPostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: EditPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  return {
    title: post ? `Redaktə: ${post.title} | Mənim Bloqum` : "Məqalə tapılmadı",
  };
}

export default async function EditPostPage({ params }: EditPostPageProps) {
  const { slug } = await params;

  // Defense-in-depth: əsl qapı `updatePostAction` daxilindəki yoxlamalardır.
  const user = await requireUser(`/login?from=/edit-post/${slug}`);
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  if (!canManagePost(user, post)) {
    // İcazə yoxdursa məqalənin özünə qaytarırıq
    redirect(`/blog/${slug}`);
  }

  return (
    <div className="max-w-2xl mx-auto py-8 px-4 sm:px-6">
      <Link
        href={`/blog/${slug}`}
        className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-800 mb-6 transition-colors"
      >
        <span>←</span>
        <span>Məqaləyə qayıt</span>
      </Link>

      <div className="bg-white p-8 sm:p-10 rounded-2xl border border-slate-200/80 shadow-xl shadow-slate-200/30">
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-100">
              Redaktə rejimi
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Məqaləni Redaktə Et
          </h1>
          <p className="mt-1.5 text-sm text-slate-500">
            Dəyişiklikləri etdikdən sonra yadda saxlayın. URL-i dəyişsəniz, köhnə ünvan
            avtomatik yeni ünvana yönləndiriləcək.
          </p>
        </div>

        <PostForm
          action={updatePostAction.bind(null, post.id)}
          submitLabel="Dəyişiklikləri Yadda Saxla"
          submitLoadingLabel="Yadda saxlanılır..."
          currentSlug={post.slug}
          initialValues={{
            title: post.title,
            category: post.category,
            excerpt: post.excerpt,
            content: post.content,
          }}
        />
      </div>
    </div>
  );
}
