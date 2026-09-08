"use server";

import { Prisma } from "@prisma/client";
import { getPosts } from "@/lib/posts";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { createPostSchema } from "@/lib/validations/post";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { generateSlug } from "@/lib/slug";
import type { GetPostsOptions, PostSummary } from "@/types/post";

/**
 * Server Action:
 * Brauzerdəki Client Component-dən birbaşa çağırılır.
 * REST API marşrutu (/api/posts) yaratmağa ehtiyac qalmadan,
 * Next.js-in daxili RPC mexanizmi ilə birbaşa PostgreSQL-dən növbəti səhifəni gətirir.
 */
export async function fetchMorePosts(options: GetPostsOptions): Promise<PostSummary[]> {
  return await getPosts(options);
}

export interface CreatePostState {
  error?: string;
  fieldErrors?: Record<string, string[]>;
  fields?: {
    title?: string;
    category?: string;
    excerpt?: string;
    content?: string;
  };
  success?: boolean;
}

/**
 * Server Action: Yeni məqalə əlavə etmək
 * Qayda: Yalnız daxil olmuş istifadəçilər (USER və ya ADMIN) öz adlarından post yarada bilər.
 */
export async function createPostAction(_prevState: CreatePostState | null, formData: FormData): Promise<CreatePostState> {
  // 1. İstifadəçi sessiyasının təhlükəsiz yoxlanması
  let currentUser;
  try {
    currentUser = await requireAuth();
  } catch {
    return { error: "Məqalə dərc etmək üçün daxil olmalısınız." };
  }

  const rawFields = {
    title: formData.get("title")?.toString() || "",
    category: formData.get("category")?.toString() || "",
    excerpt: formData.get("excerpt")?.toString() || "",
    content: formData.get("content")?.toString() || "",
  };

  // 2. Zod ilə sahələrin validasiyası (category yalnız icazəli siyahıdan, max uzunluqlar)
  const validatedFields = createPostSchema.safeParse(rawFields);

  if (!validatedFields.success) {
    return {
      fieldErrors: validatedFields.error.flatten().fieldErrors,
      fields: rawFields,
    };
  }

  const { title, category, excerpt, content } = validatedFields.data;

  let finalSlug = generateSlug(title);
  if (!finalSlug) {
    finalSlug = `post-${Date.now()}`;
  }

  // 3. Slug-ın unikal olmasının yoxlanması
  const existingPost = await prisma.post.findUnique({ where: { slug: finalSlug } });

  if (existingPost) {
    finalSlug = `${finalSlug}-${Math.floor(1000 + Math.random() * 9000)}`;
  }

  try {
    await prisma.post.create({
      data: {
        title,
        slug: finalSlug,
        category,
        excerpt,
        content,
        authorId: currentUser.id,
      },
    });

    revalidatePath("/", "layout");
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return {
        error: "Bu başlıqla məqalə artıq mövcuddur. Zəhmət olmasa başlığı bir qədər fərqli edin.",
        fields: rawFields,
      };
    }
    console.error("Məqalə yaradılarkən xəta:", error);
    return {
      error: "Məqalə bazaya yazılarkən xəta baş verdi. Yenidən cəhd edin.",
      fields: rawFields,
    };
  }

  redirect(`/blog/${finalSlug}`);
}
