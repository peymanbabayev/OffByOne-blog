import { z } from "zod";
import { POST_CATEGORIES } from "@/constants/blog";
import { isBlobUrl } from "@/lib/image";
import type { Dictionary } from "@/i18n/types";

/**
 * Yeni məqalə forması üçün Zod validasiya sxemi.
 * `category` yalnız icazəli siyahıdan (`POST_CATEGORIES`) qəbul edilir və
 * bütün mətn sahələrində maksimum uzunluq məhdudiyyəti var.
 *
 * Server Action-lar `next/root-params`-dan istifadə edə bilmədiyi üçün mesajlar
 * bir `Dictionary` qəbul edən factory funksiya vasitəsilə lokallaşdırılır.
 */
export function getCreatePostSchema(dict: Dictionary) {
  return z.object({
    title: z
      .string({ message: dict.validation.titleRequired })
      .trim()
      .min(3, dict.validation.titleMin)
      .max(120, dict.validation.titleMax),
    category: z.enum(POST_CATEGORIES, { message: dict.validation.categoryInvalid }),
    excerpt: z
      .string({ message: dict.validation.excerptRequired })
      .trim()
      .min(10, dict.validation.excerptMin)
      .max(300, dict.validation.excerptMax),
    content: z
      .string({ message: dict.validation.contentRequired })
      .trim()
      .min(20, dict.validation.contentMin)
      .max(20000, dict.validation.contentMax),
    // Örtük şəkli istəyə bağlıdır. Boş sətir = şəkil yoxdur; dolu olduqda yalnız
    // bizim Vercel Blob store-una aid URL qəbul olunur (client-upload nəticəsi).
    coverImage: z
      .string()
      .trim()
      .refine((value) => value === "" || isBlobUrl(value), {
        message: dict.validation.coverImageInvalid,
      })
      .optional()
      .default(""),
  });
}

export type CreatePostInput = z.infer<ReturnType<typeof getCreatePostSchema>>;
