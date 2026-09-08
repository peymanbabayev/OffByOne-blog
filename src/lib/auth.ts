import "server-only";

import { cache } from "react";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import type { Role } from "@prisma/client";

/**
 * Data Access Layer (DAL) — Next.js 16 rəsmi tövsiyəsi.
 * Autentifikasiya və avtorizasiyanın ƏSL sərhədi buradadır; `src/proxy.ts` yalnız
 * optimistik (cookie imzası) yoxlama edir. Hər səhifə və Server Action öz
 * icazəsini buradakı funksiyalarla təsdiqləməlidir.
 */

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar: string | null;
  createdAt: Date;
}

/**
 * Aktiv sessiyaya əsasən bazadan cari istifadəçini gətirir (şifrə hash-i çıxarılmaqla).
 * - Hər çağırışda birbaşa bazadan ən son məlumatı yoxlayır (rol dəyişikliyi dərhal təsir edir).
 * - Tokendəki `sv` bazadakı `sessionVersion` ilə uyğun gəlmirsə sessiya ləğv edilmiş sayılır.
 * - React `cache()` ilə əhatələnib — eyni render zamanı yalnız bir DB sorğusu.
 */
export const getCurrentUser = cache(async (): Promise<AuthUser | null> => {
  try {
    const session = await getSession();
    if (!session?.userId) {
      return null;
    }

    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        avatar: true,
        createdAt: true,
        sessionVersion: true,
      },
    });

    if (!user || user.sessionVersion !== session.sv) {
      return null;
    }

    // `sessionVersion` DTO-ya daxil edilmir — yalnız lazım olan sahələr qaytarılır.
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      createdAt: user.createdAt,
    };
  } catch (error) {
    // Next.js idarəetmə xətalarını (dynamic rendering, redirect, not-found) udmuruq
    if (
      error &&
      typeof error === "object" &&
      "digest" in error &&
      typeof error.digest === "string" &&
      (error.digest === "DYNAMIC_SERVER_USAGE" || error.digest.startsWith("NEXT_"))
    ) {
      throw error;
    }
    console.error("Cari istifadəçi məlumatı gətirilərkən xəta:", error);
    return null;
  }
});

/**
 * Giriş tələb edən Server Action-larda istifadəçi mövcudluğunu təsdiqləyir.
 * Daxil olmayıbsa xəta atır (try/catch içində istifadə üçün).
 */
export async function requireAuth(): Promise<AuthUser> {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("Bu əməliyyatı yerinə yetirmək üçün daxil olmalısınız.");
  }
  return user;
}

/**
 * Səhifələrdə (Server Component) istifadə üçün: daxil olmayıbsa `redirect()` edir.
 */
export async function requireUser(redirectTo: string = "/login"): Promise<AuthUser> {
  const user = await getCurrentUser();
  if (!user) {
    redirect(redirectTo);
  }
  return user;
}

/**
 * Mərkəzi avtorizasiya funksiyası — DB-dən AKTUAL rolu yoxlayır.
 * Uğursuz olarsa `redirect()` edir. Admin `layout.tsx` və Admin səhifələri üçün.
 */
export async function requireAdmin(redirectTo: string = "/"): Promise<AuthUser> {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") {
    redirect(redirectTo);
  }
  return user;
}

/**
 * `requireAdmin`-in xəta atan variantı — Server Action daxilində try/catch üçün.
 */
export async function assertAdmin(): Promise<AuthUser> {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") {
    throw new Error("Bu əməliyyat yalnız Admin istifadəçilər üçün nəzərdə tutulub.");
  }
  return user;
}
