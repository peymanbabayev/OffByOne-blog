"use server";

import { Prisma } from "@prisma/client";
import { getPosts } from "@/lib/posts";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { canManagePost } from "@/lib/permissions";
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

/**
 * Həm yaratma, həm də redaktə forması üçün ortaq state tipi
 * (`useActionState` ilə istifadə olunur).
 */
export interface PostFormState {
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

/** Geriyə uyğunluq üçün köhnə ad. */
export type CreatePostState = PostFormState;

/** FormData-dan xam mətn sahələrini çıxarır. */
function readPostFields(formData: FormData): NonNullable<PostFormState["fields"]> {
  return {
    title:    formData.get("title")?.toString() || "",
    category: formData.get("category")?.toString() || "",
    excerpt:  formData.get("excerpt")?.toString() || "",
    content:  formData.get("content")?.toString() || "",
  };
}

/**
 * Server Action: Yeni məqalə əlavə etmək
 * Qayda: Yalnız daxil olmuş istifadəçilər (USER və ya ADMIN) öz adlarından post yarada bilər.
 */
export async function createPostAction(_prevState: PostFormState | null,formData: FormData): Promise<PostFormState> {
  // 1. İstifadəçi sessiyasının təhlükəsiz yoxlanması
  let currentUser;
  try {
    currentUser = await requireAuth();
  } catch {
    return { error: "Məqalə dərc etmək üçün daxil olmalısınız." };
  }

  const rawFields = readPostFields(formData);

  // 2. Zod ilə sahələrin validasiyası (category yalnız icazəli siyahıdan, max uzunluqlar)
  const validatedFields = createPostSchema.safeParse(rawFields);
  if (!validatedFields.success) {
    return {
      fieldErrors: validatedFields.error.flatten().fieldErrors,
      fields: rawFields,
    };
  }

  const { title, category, excerpt, content } = validatedFields.data;

  let finalSlug = generateSlug(title) || `post-${Date.now()}`;

  // 3. Slug-ın unikal olmasının yoxlanması
  const existingPost = await prisma.post.findUnique({ where: { slug: finalSlug } });
  if (existingPost) {
    finalSlug = `${finalSlug}-${Math.floor(1000 + Math.random() * 9000)}`;
  }

  try {
    await prisma.post.create({
      data: { title, slug: finalSlug, category, excerpt, content, authorId: currentUser.id },
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

/**
 * Server Action: Mövcud məqaləni redaktə etmək.
 *
 * - `postId` client tərəfindən `.bind(null, id)` ilə ötürülür; icazə HƏMİŞƏ
 *   serverdə sessiyaya əsasən yenidən yoxlanılır (`canManagePost`).
 * - Slug (URL) QƏSDƏN dəyişdirilmir: dərc olunmuş linklərin və SEO-nun
 *   qırılmaması üçün başlıq dəyişsə belə `slug` sabit qalır.
 */
export async function updatePostAction(postId: string, _prevState: PostFormState | null, formData: FormData): Promise<PostFormState> {
  let currentUser;
  try {
    currentUser = await requireAuth();
  } catch {
    return { error: "Məqaləni redaktə etmək üçün daxil olmalısınız." };
  }

  const existing = await prisma.post.findUnique({
    where: { id: postId },
    select: { id: true, slug: true, authorId: true },
  });

  if (!existing) {
    return { error: "Məqalə tapılmadı və ya artıq silinib." };
  }

  if (!canManagePost(currentUser, existing)) {
    return { error: "Bu məqaləni redaktə etmək icazəniz yoxdur." };
  }

  const rawFields = readPostFields(formData);

  const validatedFields = createPostSchema.safeParse(rawFields);
  if (!validatedFields.success) {
    return {
      fieldErrors: validatedFields.error.flatten().fieldErrors,
      fields: rawFields,
    };
  }

  const { title, category, excerpt, content } = validatedFields.data;

  try {
    await prisma.post.update({
      where: { id: postId },
      data: { title, category, excerpt, content },
    });
    revalidatePath("/", "layout");
    revalidatePath(`/blog/${existing.slug}`);
  } catch (error) {
    console.error("Məqalə yenilənərkən xəta:", error);
    return {
      error: "Məqalə yenilənərkən xəta baş verdi. Yenidən cəhd edin.",
      fields: rawFields,
    };
  }

  redirect(`/blog/${existing.slug}`);
}

export interface DeletePostState {error?: string;}

/**
 * Server Action: Məqaləni silmək.
 * `useActionState` ilə istifadə üçün `(prevState, formData)` imzası; `postId`
 * gizli sahədən oxunur, icazə isə HƏMİŞƏ serverdə sessiyaya görə yoxlanılır.
 * Uğurlu halda `redirect` atır, xəta halında state qaytarır.
 */
export async function deletePostAction(_prevState: DeletePostState | null, formData: FormData): Promise<DeletePostState> {
  const postId = formData.get("postId")?.toString();
  if (!postId) {
    return { error: "Məqalə identifikatoru tapılmadı." };
  }

  let currentUser;
  try {
    currentUser = await requireAuth();
  } catch {
    return { error: "Məqaləni silmək üçün daxil olmalısınız." };
  }

  const existing = await prisma.post.findUnique({
    where: { id: postId },
    select: { id: true, slug: true, authorId: true },
  });

  if (!existing) {
    return { error: "Məqalə tapılmadı və ya artıq silinib." };
  }

  if (!canManagePost(currentUser, existing)) {
    return { error: "Bu məqaləni silmək icazəniz yoxdur." };
  }

  try {
    await prisma.post.delete({ where: { id: postId } });
    revalidatePath("/", "layout");
    revalidatePath(`/blog/${existing.slug}`);
  } catch (error) {
    console.error("Məqalə silinərkən xəta:", error);
    return { error: "Məqalə silinərkən xəta baş verdi. Yenidən cəhd edin." };
  }

  redirect("/");
}
