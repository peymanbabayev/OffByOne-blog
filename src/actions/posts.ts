"use server";

import { Prisma } from "@prisma/client";
import { getPosts, searchPostsForPalette } from "@/lib/posts";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { canManagePost } from "@/lib/permissions";
import { deleteBlob } from "@/lib/blob";
import { getCreatePostSchema } from "@/lib/validations/post";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { generateSlug } from "@/lib/slug";
import { isSlugTaken, makeUniqueSlug } from "@/lib/post-slug";
import { localeFromFormData } from "@/i18n/action-locale";
import { getDictionaryFor } from "@/i18n/dictionaries";
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
 * Server Action: Spotlight (⌘K) sürətli keçid pəncərəsi üçün axtarış.
 * Nəticələr birbaşa yazıya keçid üçündür (siyahı filtri deyil — o, `?q=` ilə işləyir).
 */
export async function paletteSearchAction(term: string): Promise<PostSummary[]> {
  return searchPostsForPalette(term);
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
    slug?: string;
    coverImage?: string;
  };
  success?: boolean;
}

/** Geriyə uyğunluq üçün köhnə ad. */
export type CreatePostState = PostFormState;

/** FormData-dan xam mətn sahələrini çıxarır (`slug` yalnız redaktə formasında olur). */
function readPostFields(formData: FormData): NonNullable<PostFormState["fields"]> {
  return {
    title:      formData.get("title")?.toString() || "",
    category:   formData.get("category")?.toString() || "",
    excerpt:    formData.get("excerpt")?.toString() || "",
    content:    formData.get("content")?.toString() || "",
    slug:       formData.get("slug")?.toString() || "",
    coverImage: formData.get("coverImage")?.toString() || "",
  };
}

/**
 * Server Action: Yeni məqalə əlavə etmək
 * Qayda: Yalnız daxil olmuş istifadəçilər (USER və ya ADMIN) öz adlarından post yarada bilər.
 */
export async function createPostAction(_prevState: PostFormState | null,formData: FormData): Promise<PostFormState> {
  const lang = localeFromFormData(formData);
  const dict = getDictionaryFor(lang);

  // 1. İstifadəçi sessiyasının təhlükəsiz yoxlanması
  let currentUser;
  try {
    currentUser = await requireAuth();
  } catch {
    return { error: dict.postActions.mustBeLoggedInPublish };
  }

  const rawFields = readPostFields(formData);

  // 2. Zod ilə sahələrin validasiyası (category yalnız icazəli siyahıdan, max uzunluqlar)
  const validatedFields = getCreatePostSchema(dict).safeParse(rawFields);
  if (!validatedFields.success) {
    return {
      fieldErrors: validatedFields.error.flatten().fieldErrors,
      fields: rawFields,
    };
  }

  const { title, category, excerpt, content, coverImage } = validatedFields.data;

  // 3. Başlıqdan qlobal unikal slug (aktiv slug-lar + köhnə ünvanlar nəzərə alınır)
  const finalSlug = await makeUniqueSlug(title);

  try {
    await prisma.post.create({
      data: {
        title,
        slug: finalSlug,
        category,
        excerpt,
        content,
        coverImage: coverImage || null,
        authorId: currentUser.id,
      },
    });
    revalidatePath("/", "layout");
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return {
        error: dict.postActions.titleTaken,
        fields: rawFields,
      };
    }
    console.error("Məqalə yaradılarkən xəta:", error);
    return {
      error: dict.postActions.createFailed,
      fields: rawFields,
    };
  }

  redirect(`/${lang}/blog/${finalSlug}`);
}

/**
 * Server Action: Mövcud məqaləni redaktə etmək.
 *
 * - `postId` client tərəfindən `.bind(null, id)` ilə ötürülür; icazə HƏMİŞƏ
 *   serverdə sessiyaya əsasən yenidən yoxlanılır (`canManagePost`).
 * - Slug (URL) redaktə oluna bilər. Dəyişdirildikdə:
 *   • yeni slug qlobal unikallıq üçün yoxlanılır (aktiv slug-lar + köhnə ünvanlar),
 *   • KÖHNƏ slug `PostSlugHistory`-yə yazılır ki, köhnə linklər 308 ilə yönləndirilsin,
 *   • bütün əməliyyat tək tranzaksiyada aparılır.
 */
export async function updatePostAction(postId: string, _prevState: PostFormState | null, formData: FormData): Promise<PostFormState> {
  const lang = localeFromFormData(formData);
  const dict = getDictionaryFor(lang);

  let currentUser;
  try {
    currentUser = await requireAuth();
  } catch {
    return { error: dict.postActions.mustBeLoggedInEdit };
  }

  const existing = await prisma.post.findUnique({
    where: { id: postId },
    select: { id: true, slug: true, authorId: true, coverImage: true },
  });

  if (!existing) {
    return { error: dict.postActions.postNotFound };
  }

  if (!canManagePost(currentUser, existing)) {
    return { error: dict.postActions.noEditPermission };
  }

  const rawFields = readPostFields(formData);

  const validatedFields = getCreatePostSchema(dict).safeParse(rawFields);
  if (!validatedFields.success) {
    return {
      fieldErrors: validatedFields.error.flatten().fieldErrors,
      fields: rawFields,
    };
  }

  const { title, category, excerpt, content, coverImage } = validatedFields.data;
  const nextCover = coverImage || null;
  const coverChanged = nextCover !== (existing.coverImage ?? null);

  // --- Slug (URL) ---
  const desiredSlug = generateSlug(rawFields.slug ?? "");
  const slugChanged = desiredSlug.length > 0 && desiredSlug !== existing.slug;
  const echoFields = { ...rawFields, slug: slugChanged ? desiredSlug : existing.slug };

  if (slugChanged && (await isSlugTaken(desiredSlug, existing.id))) {
    return {
      error: dict.postActions.slugTaken,
      fieldErrors: { slug: [dict.postActions.slugTakenField] },
      fields: echoFields,
    };
  }

  const finalSlug = slugChanged ? desiredSlug : existing.slug;

  try {
    if (slugChanged) {
      await prisma.$transaction([
        // Məqalə öz köhnə ünvanını geri götürürsə, həmin tarixçə qeydini silirik
        prisma.postSlugHistory.deleteMany({ where: { slug: desiredSlug, postId: existing.id } }),
        // Köhnə slug-ı tarixçəyə yazırıq (köhnə linklərin 308 yönləndirilməsi üçün)
        prisma.postSlugHistory.upsert({
          where: { slug: existing.slug },
          create: { slug: existing.slug, postId: existing.id },
          update: { postId: existing.id },
        }),
        prisma.post.update({
          where: { id: existing.id },
          data: { title, category, excerpt, content, coverImage: nextCover, slug: finalSlug },
        }),
      ]);
    } else {
      await prisma.post.update({
        where: { id: existing.id },
        data: { title, category, excerpt, content, coverImage: nextCover },
      });
    }

    // Örtük dəyişdisə köhnə faylı Blob store-dan təmizlə (xəta udulur).
    if (coverChanged) await deleteBlob(existing.coverImage);

    revalidatePath("/", "layout");
    revalidatePath(`/blog/${existing.slug}`);
    if (slugChanged) revalidatePath(`/blog/${finalSlug}`);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return {
        error: dict.postActions.slugTaken,
        fieldErrors: { slug: [dict.postActions.slugTakenFieldUpdate] },
        fields: echoFields,
      };
    }
    console.error("Məqalə yenilənərkən xəta:", error);
    return {
      error: dict.postActions.updateFailed,
      fields: echoFields,
    };
  }

  redirect(`/${lang}/blog/${finalSlug}`);
}

export interface DeletePostState {error?: string;}

/**
 * Server Action: Məqaləni silmək.
 * `useActionState` ilə istifadə üçün `(prevState, formData)` imzası; `postId`
 * gizli sahədən oxunur, icazə isə HƏMİŞƏ serverdə sessiyaya görə yoxlanılır.
 * Uğurlu halda `redirect` atır, xəta halında state qaytarır.
 */
export async function deletePostAction(_prevState: DeletePostState | null, formData: FormData): Promise<DeletePostState> {
  const lang = localeFromFormData(formData);
  const dict = getDictionaryFor(lang);

  const postId = formData.get("postId")?.toString();
  if (!postId) {
    return { error: dict.postActions.missingId };
  }

  let currentUser;
  try {
    currentUser = await requireAuth();
  } catch {
    return { error: dict.postActions.mustBeLoggedInDelete };
  }

  const existing = await prisma.post.findUnique({
    where: { id: postId },
    select: { id: true, slug: true, authorId: true, coverImage: true },
  });

  if (!existing) {
    return { error: dict.postActions.postNotFound };
  }

  if (!canManagePost(currentUser, existing)) {
    return { error: dict.postActions.noDeletePermission };
  }

  // `redirectTo` client tərəfindən gələn gizli sahədir — yalnız sayt daxili
  // (tək `/` ilə başlayan) yola icazə veririk ki, açıq yönləndirmə olmasın.
  const rawRedirectTo = formData.get("redirectTo")?.toString() || "/";
  const redirectTo =
    rawRedirectTo.startsWith("/") && !rawRedirectTo.startsWith("//")
      ? rawRedirectTo
      : "/";

  try {
    await prisma.post.delete({ where: { id: postId } });
    await deleteBlob(existing.coverImage);
    revalidatePath("/", "layout");
    revalidatePath("/my-posts");
    revalidatePath(`/blog/${existing.slug}`);
  } catch (error) {
    console.error("Məqalə silinərkən xəta:", error);
    return { error: dict.postActions.deleteFailed };
  }

  redirect(`/${lang}${redirectTo}`);
}
