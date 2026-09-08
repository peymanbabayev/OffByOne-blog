import type { Role } from "@prisma/client";

/**
 * Məqalə üzərində idarəetmə (redaktə / silmə) icazəsi.
 *
 * Qayda: yalnız məqalənin müəllifi VƏ YA ADMIN rollu istifadəçi.
 * Bu funksiya həm Server Action-larda (icazə yoxlaması), həm də səhifələrdə
 * (idarəetmə düymələrinin göstərilib-göstərilməməsi) istifadə olunur.
 */
export function canManagePost(user: { id: string; role: Role } | null | undefined, post: { authorId: string | null }): boolean {
  if (!user) return false;
  return user.role === "ADMIN" || post.authorId === user.id;
}
