"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { deleteBlob } from "@/lib/blob";
import { isBlobUrl } from "@/lib/image";

export interface AvatarActionState {
  error?: string;
  success?: boolean;
}

const avatarSchema = z
  .string()
  .trim()
  .refine((value) => value === "" || isBlobUrl(value), {
    message: "Profil şəkli URL-i etibarsızdır.",
  });

/**
 * Server Action: istifadəçinin profil şəklini (avatar) yeniləyir.
 *
 * URL client-upload nəticəsidir (`ImageUpload` → `/api/blob/upload`); burada
 * yalnız auth + URL yoxlaması edilir, sonra `User.avatar` yazılır və köhnə blob
 * (varsa) təmizlənir. Boş dəyər avatarı silir.
 */
export async function updateAvatarAction(
  _prevState: AvatarActionState | null,
  formData: FormData
): Promise<AvatarActionState> {
  let user;
  try {
    user = await requireAuth();
  } catch {
    return { error: "Bu əməliyyat üçün daxil olmalısınız." };
  }

  const parsed = avatarSchema.safeParse(formData.get("avatar")?.toString() ?? "");
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Profil şəkli URL-i etibarsızdır." };
  }

  const nextAvatar = parsed.data || null;
  const currentAvatar = user.avatar ?? null;

  if (nextAvatar === currentAvatar) {
    return { success: true };
  }

  try {
    await prisma.user.update({
      where: { id: user.id },
      data: { avatar: nextAvatar },
    });

    if (currentAvatar) await deleteBlob(currentAvatar);

    revalidatePath("/", "layout");
    revalidatePath("/settings");
    return { success: true };
  } catch (error) {
    console.error("Avatar yenilənərkən xəta:", error);
    return { error: "Əməliyyat alınmadı. Bir az sonra yenidən cəhd edin." };
  }
}
