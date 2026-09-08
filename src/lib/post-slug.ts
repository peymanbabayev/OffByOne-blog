import "server-only";

import { prisma } from "@/lib/prisma";
import { generateSlug } from "@/lib/slug";

/**
 * Verilmiş slug başqa bir məqalə tərəfindən — aktiv `Post.slug` VƏ YA köhnə
 * ünvan (`PostSlugHistory.slug`) kimi — tutulubmu?
 *
 * `exceptPostId` verildikdə, həmin məqalənin öz (aktiv və ya köhnə) slug-ları
 * "tutulmuş" sayılmır — belə ki, məqalə öz köhnə URL-ini geri götürə bilsin.
 */
export async function isSlugTaken(slug: string, exceptPostId?: string): Promise<boolean> {
  const [activePost, historical] = await Promise.all([
    prisma.post.findUnique({ where: { slug }, select: { id: true } }),
    prisma.postSlugHistory.findUnique({ where: { slug }, select: { postId: true } }),
  ]);

  if (activePost && activePost.id !== exceptPostId) return true;
  if (historical && historical.postId !== exceptPostId) return true;
  return false;
}

/**
 * İstənilən mətndən təmiz və QLOBAL UNİKAL slug qaytarır.
 * Baza slug-ı (aktiv və ya köhnə ünvan) artıq tutulubsa, sonuna təsadüfi rəqəm əlavə edir.
 */
export async function makeUniqueSlug(desired: string, exceptPostId?: string): Promise<string> {
  const base = generateSlug(desired) || `post-${Date.now()}`;

  if (!(await isSlugTaken(base, exceptPostId))) return base;

  for (let i = 0; i < 5; i++) {
    const candidate = `${base}-${Math.floor(1000 + Math.random() * 9000)}`;
    if (!(await isSlugTaken(candidate, exceptPostId))) return candidate;
  }

  return `${base}-${Date.now()}`;
}
