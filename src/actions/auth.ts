"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { createSession, destroySession } from "@/lib/session";
import { requireAuth } from "@/lib/auth";
import { getRegisterSchema, getLoginSchema } from "@/lib/validations/auth";
import { sanitizeRedirectPath } from "@/lib/redirects";
import { localeFromFormData } from "@/i18n/action-locale";
import { getDictionaryFor } from "@/i18n/dictionaries";
import type { Locale } from "@/i18n/config";

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

export interface SecurityActionState {
  error?: string;
  success?: boolean;
}

/**
 * Yeni istifadəçi qeydiyyatı.
 * Qayda: bütün yeni istifadəçilər avtomatik "USER" rolu alır.
 * Enumerasiyaya qarşı: e-poçt artıq mövcud olduqda generik mesaj qaytarılır.
 *
 * `next/root-params` Server Action-larda işləmədiyi üçün dil gizli `lang`
 * sahəsindən oxunur (bax: LoginForm/RegisterForm, i18n/action-locale.ts).
 */
export async function registerAction( _prevState: AuthActionState | null, formData: FormData): Promise<AuthActionState> {
  const lang = localeFromFormData(formData);
  const dict = getDictionaryFor(lang);

  const validatedFields = getRegisterSchema(dict).safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  });

  if (!validatedFields.success) {
    return { fieldErrors: validatedFields.error.flatten().fieldErrors };
  }

  const { name, email, password } = validatedFields.data;
  const genericError = dict.authActions.registerGenericError;

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email },
      select: { id: true },
    });

    if (existingUser) {
      return { error: genericError };
    }

    const hashedPassword = await bcrypt.hash(password, BCRYPT_ROUNDS);

    const newUser = await prisma.user.create({
      data: { name, email, password: hashedPassword, role: "USER" },
      select: { id: true, role: true, sessionVersion: true },
    });

    await createSession(newUser.id, newUser.role, newUser.sessionVersion);
    revalidatePath("/", "layout");
  } catch (error) {
    // Unikal məhdudiyyət yarışı (race condition) — yenə generik mesaj
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return { error: genericError };
    }
    console.error("Qeydiyyat zamanı xəta:", error);
    return { error: dict.authActions.registerSystemError };
  }

  redirect(`/${lang}${sanitizeRedirectPath(formData.get("from")?.toString())}`);
}

/**
 * Mövcud istifadəçinin sistemə girişi.
 * Enumerasiyaya qarşı: "istifadəçi yoxdur" və "şifrə yanlışdır" hallarında
 * eyni mesaj və təxminən eyni icra müddəti (dummy bcrypt compare).
 */
export async function loginAction( _prevState: AuthActionState | null, formData: FormData): Promise<AuthActionState> {
  const lang = localeFromFormData(formData);
  const dict = getDictionaryFor(lang);

  const validatedFields = getLoginSchema(dict).safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!validatedFields.success) {
    return { fieldErrors: validatedFields.error.flatten().fieldErrors };
  }

  const { email, password } = validatedFields.data;
  const invalidCredentials = dict.authActions.invalidCredentials;

  try {
    const user = await prisma.user.findUnique({
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

    await createSession(user.id, user.role, user.sessionVersion);
    revalidatePath("/", "layout");
  } catch (error) {
    console.error("Giriş zamanı xəta:", error);
    return { error: dict.authActions.loginSystemError };
  }

  redirect(`/${lang}${sanitizeRedirectPath(formData.get("from")?.toString())}`);
}

/**
 * Sistemdən çıxış — yalnız cari cihazın cookie-sini silir.
 * `<form action={logoutAction}>` gizli `lang` sahəsi ilə çağırılır (bax: UserMenu.tsx).
 */
export async function logoutAction(formData: FormData): Promise<void> {
  const lang = localeFromFormData(formData);
  await destroySession();
  revalidatePath("/", "layout");
  redirect(`/${lang}/login`);
}

/**
 * Bütün DİGƏR cihazlardan çıxış — `sessionVersion` artırılır (bu istifadəçinin
 * bütün mövcud tokenləri DAL səviyyəsində etibarsızlaşır), sonra CARİ cihazın
 * cookie-si yeni `sv` ilə yenidən verilir ki, bu sessiya açıq qalsın.
 * Digər cihazlar növbəti sorğuda `getCurrentUser()`-dəki `sv` yoxlamasında çıxır.
 *
 * Forma deyil, birbaşa çağırış olduğu üçün (bax: SignOutOtherDevicesButton.tsx)
 * dil `formData` əvəzinə birbaşa arqument kimi ötürülür.
 *
 * Qeyd: gələcək parol-dəyişmə/sıfırlama axını da `sessionVersion`-u artırmalı və
 * istifadəçi öz sessiyasındadırsa cari cookie-ni eyni şəkildə yenidən verməlidir.
 */
export async function signOutOtherDevicesAction(lang: Locale): Promise<SecurityActionState> {
  const dict = getDictionaryFor(lang);

  let user;
  try {
    user = await requireAuth();
  } catch {
    return { error: dict.authActions.mustBeLoggedIn };
  }

  try {
    const updated = await prisma.user.update({
      where: { id: user.id },
      data: { sessionVersion: { increment: 1 } },
      select: { sessionVersion: true },
    });

    // Cari cihazın cookie-sini yeni `sv` ilə yenidən ver — bu sessiya açıq qalır.
    await createSession(user.id, user.role, updated.sessionVersion);

    revalidatePath("/", "layout");
    return { success: true };
  } catch (error) {
    console.error("Digər cihazlardan çıxış zamanı xəta:", error);
    return { error: dict.authActions.signOutOthersFailed };
  }
}
