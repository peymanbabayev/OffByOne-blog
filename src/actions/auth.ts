"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { createSession, destroySession } from "@/lib/session";
import { requireAuth } from "@/lib/auth";
import { registerSchema, loginSchema } from "@/lib/validations/auth";
import { sanitizeRedirectPath } from "@/lib/redirects";

const BCRYPT_ROUNDS = 10;

/**
 * İstifadəçi mövcud olmadıqda da `bcrypt.compare` işləsin deyə əvvəlcədən
 * hesablanmış "boş" hash. Timing side-channel (istifadəçi enumerasiyası) qarşısını alır.
 */
const DUMMY_PASSWORD_HASH = bcrypt.hashSync("timing-attack-dummy-password", BCRYPT_ROUNDS);

export interface AuthActionState {
  error?: string;
  fieldErrors?: Record<string, string[]>;
  success?: boolean;
}

/**
 * Yeni istifadəçi qeydiyyatı.
 * Qayda: bütün yeni istifadəçilər avtomatik "USER" rolu alır.
 * Enumerasiyaya qarşı: e-poçt artıq mövcud olduqda generik mesaj qaytarılır.
 */
export async function registerAction(
  _prevState: AuthActionState | null,
  formData: FormData
): Promise<AuthActionState> {
  const validatedFields = registerSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  });

  if (!validatedFields.success) {
    return { fieldErrors: validatedFields.error.flatten().fieldErrors };
  }

  const { name, email, password } = validatedFields.data;
  const genericError =
    "Qeydiyyatı tamamlamaq mümkün olmadı. Məlumatları yoxlayıb yenidən cəhd edin.";

  let newUser: { id: string; role: "USER" | "ADMIN"; sessionVersion: number } | null = null;

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email },
      select: { id: true },
    });

    if (existingUser) {
      return { error: genericError };
    }

    const hashedPassword = await bcrypt.hash(password, BCRYPT_ROUNDS);

    newUser = await prisma.user.create({
      data: { name, email, password: hashedPassword, role: "USER" },
      select: { id: true, role: true, sessionVersion: true },
    });
  } catch (error) {
    // Unikal məhdudiyyət yarışı (race condition) — yenə generik mesaj
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return { error: genericError };
    }
    console.error("Qeydiyyat zamanı xəta:", error);
    return { error: "Sistem xətası baş verdi. Zəhmət olmasa bir az sonra yenidən cəhd edin." };
  }

  if (!newUser) {
    return { error: genericError };
  }

  await createSession(newUser.id, newUser.role, newUser.sessionVersion);
  revalidatePath("/", "layout");
  redirect(sanitizeRedirectPath(formData.get("from")?.toString()));
}

/**
 * Mövcud istifadəçinin sistemə girişi.
 * Enumerasiyaya qarşı: "istifadəçi yoxdur" və "şifrə yanlışdır" hallarında
 * eyni mesaj və təxminən eyni icra müddəti (dummy bcrypt compare).
 */
export async function loginAction(
  _prevState: AuthActionState | null,
  formData: FormData
): Promise<AuthActionState> {
  const validatedFields = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!validatedFields.success) {
    return { fieldErrors: validatedFields.error.flatten().fieldErrors };
  }

  const { email, password } = validatedFields.data;
  const invalidCredentials = "E-poçt və ya şifrə yanlışdır.";

  let user: {
    id: string;
    password: string;
    role: "USER" | "ADMIN";
    sessionVersion: number;
  } | null = null;

  try {
    user = await prisma.user.findUnique({
      where: { email },
      select: { id: true, password: true, role: true, sessionVersion: true },
    });

    const passwordMatches = await bcrypt.compare(
      password,
      user?.password ?? DUMMY_PASSWORD_HASH
    );

    if (!user || !passwordMatches) {
      return { error: invalidCredentials };
    }
  } catch (error) {
    console.error("Giriş zamanı xəta:", error);
    return { error: "Giriş zamanı xəta baş verdi. Yenidən cəhd edin." };
  }

  if (!user) {
    return { error: invalidCredentials };
  }

  await createSession(user.id, user.role, user.sessionVersion);
  revalidatePath("/", "layout");
  redirect(sanitizeRedirectPath(formData.get("from")?.toString()));

  // TODO: brute-force qorunması — sadə DB/yaddaş əsaslı cəhd sayğacı (növbəti addım).
}

/**
 * Sistemdən çıxış — yalnız cari cihazın cookie-sini silir.
 */
export async function logoutAction(): Promise<void> {
  await destroySession();
  revalidatePath("/", "layout");
  redirect("/login");
}

/**
 * Bütün cihazlardan çıxış — `sessionVersion`-u artıraraq bu istifadəçinin
 * bütün mövcud tokenlərini DAL səviyyəsində etibarsızlaşdırır.
 * Qeyd: gələcək parol-sıfırlama axını da `sessionVersion`-u artırmalıdır.
 */
export async function logoutEverywhereAction(): Promise<void> {
  const user = await requireAuth();
  await prisma.user.update({
    where: { id: user.id },
    data: { sessionVersion: { increment: 1 } },
  });
  await destroySession();
  revalidatePath("/", "layout");
  redirect("/login");
}
