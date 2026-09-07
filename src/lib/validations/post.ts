import { z } from "zod";
import { POST_CATEGORIES } from "@/constants/blog";

/**
 * Yeni məqalə forması üçün Zod validasiya sxemi.
 * `category` yalnız icazəli siyahıdan (`POST_CATEGORIES`) qəbul edilir və
 * bütün mətn sahələrində maksimum uzunluq məhdudiyyəti var.
 */
export const createPostSchema = z.object({
  title: z
    .string({ message: "Başlıq daxil edilməlidir." })
    .trim()
    .min(3, "Başlıq ən azı 3 simvoldan ibarət olmalıdır.")
    .max(120, "Başlıq 120 simvoldan artıq ola bilməz."),
  category: z.enum(POST_CATEGORIES, { message: "Etibarsız kateqoriya seçildi." }),
  excerpt: z
    .string({ message: "Qısa məzmun daxil edilməlidir." })
    .trim()
    .min(10, "Qısa məzmun ən azı 10 simvoldan ibarət olmalıdır.")
    .max(300, "Qısa məzmun 300 simvoldan artıq ola bilməz."),
  content: z
    .string({ message: "Ətraflı məzmun daxil edilməlidir." })
    .trim()
    .min(20, "Ətraflı məzmun ən azı 20 simvoldan ibarət olmalıdır.")
    .max(20000, "Mətn çox uzundur (maksimum 20000 simvol)."),
});

export type CreatePostInput = z.infer<typeof createPostSchema>;
