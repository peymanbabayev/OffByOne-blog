"use server";

import { getPosts } from "@/lib/posts";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { createPostSchema } from "@/lib/validations/post";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
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
  success?: boolean;
}

/**
 * Başlıqdan SEO və URL-dostu slug yaradan köməkçi funksiya (Azərbaycan hərfləri dəstəyi ilə)
 */
function generateSlug(text: string): string {
  const azMap: Record<string, string> = {
    ə: "e",
    Ə: "e",
    ı: "i",
    I: "i",
    İ: "i",
    i: "i",
    ö: "o",
    Ö: "o",
    ü: "u",
    Ü: "u",
    ğ: "g",
    Ğ: "g",
    ç: "c",
    Ç: "c",
    ş: "s",
    Ş: "s",
  };

  const converted = text
    .split("")
    .map((char) => azMap[char] || char)
    .join("");

  return converted
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Server Action: Yeni məqalə əlavə etmək
 * Qayda: Yalnız daxil olmuş istifadəçilər (USER və ya ADMIN) öz adlarından post yarada bilər.
 */
export async function createPostAction(
  _prevState: CreatePostState | null,
  formData: FormData
): Promise<CreatePostState> {
  // 1. İstifadəçi sessiyasının təhlükəsiz yoxlanması
  let currentUser;
  try {
    currentUser = await requireAuth();
  } catch {
    return { error: "Məqalə dərc etmək üçün daxil olmalısınız." };
  }

  // 2. Zod ilə sahələrin validasiyası (category yalnız icazəli siyahıdan, max uzunluqlar)
  const validatedFields = createPostSchema.safeParse({
    title: formData.get("title"),
    category: formData.get("category"),
    excerpt: formData.get("excerpt"),
    content: formData.get("content"),
  });

  if (!validatedFields.success) {
    return { fieldErrors: validatedFields.error.flatten().fieldErrors };
  }

  const { title, category, excerpt, content } = validatedFields.data;

  let finalSlug = generateSlug(title);
  if (!finalSlug) {
    finalSlug = `post-${Date.now()}`;
  }

  // 3. Slug-ın unikal olmasının yoxlanması
  const existingPost = await prisma.post.findUnique({
    where: { slug: finalSlug },
  });

  if (existingPost) {
    finalSlug = `${finalSlug}-${Math.floor(1000 + Math.random() * 9000)}`;
  }

  let createdSlug: string | null = null;

  try {
    const newPost = await prisma.post.create({
      data: {
        title,
        slug: finalSlug,
        category,
        excerpt,
        content,
        authorId: currentUser.id,
      },
    });

    createdSlug = newPost.slug;
  } catch (error) {
    console.error("Məqalə yaradılarkən xəta:", error);
    return { error: "Məqalə bazaya yazılarkən xəta baş verdi. Yenidən cəhd edin." };
  }

  // 4. Keşi yeniləyirik və məqalə səhifəsinə yönləndiririk
  if (createdSlug) {
    revalidatePath("/");
    redirect(`/blog/${createdSlug}`);
  }

  return { success: true };
}
