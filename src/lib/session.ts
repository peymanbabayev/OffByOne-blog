import "server-only";

import { cache } from "react";
import { cookies } from "next/headers";
import {
  signToken,
  verifyToken,
  shouldRefresh,
  SESSION_COOKIE_NAME,
  SESSION_DURATION_SECONDS,
  type SessionClaims,
  type SessionPayload,
} from "./jwt";

// Təkrar ixrac edirik ki, layihədəki mövcud importlar pozulmasın
export { SESSION_COOKIE_NAME, verifyToken, shouldRefresh, type SessionPayload };

type UserRole = SessionClaims["role"];

function buildCookieOptions(expires: Date) {
  return {
    httpOnly: true, // Brauzer JS-in tokeni oxumasının qarşısını alır (XSS qoruması)
    secure: process.env.NODE_ENV === "production", // Prod-da yalnız HTTPS
    sameSite: "lax" as const, // CSRF-ə qarşı əlavə qat (Server Actions onsuz da Origin yoxlayır)
    expires,
    path: "/",
  };
}

/**
 * İstifadəçi üçün yeni JWT sessiya tokeni yaradır və httpOnly cookie-yə yazır.
 */
export async function createSession(
  userId: string,
  role: UserRole,
  sessionVersion: number
): Promise<string> {
  const token = await signToken({ userId, role, sv: sessionVersion });
  const expiresAt = new Date(Date.now() + SESSION_DURATION_SECONDS * 1000);

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, token, buildCookieOptions(expiresAt));

  return token;
}

/**
 * Mövcud sorğunun httpOnly cookie-sindən sessiya məlumatını oxuyur və yoxlayır.
 * React `cache()` ilə əhatələnib ki, eyni render zamanı təkrar oxunmasın.
 */
export const getSession = cache(async (): Promise<SessionPayload | null> => {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyToken(token);
});

/**
 * Mövcud tokeni götürüb eyni iddialarla təzəsini imzalayır və cookie-ni yeniləyir
 * (bitmə tarixini uzadır). Token etibarsızdırsa `null` qaytarır.
 * Qeyd: Server Component render zamanı cookie yazmaq olmur — bu funksiya yalnız
 * Server Action və ya Route Handler daxilində çağırıla bilər.
 */
export async function updateSession(): Promise<string | null> {
  const session = await getSession();
  if (!session) return null;

  const token = await signToken({
    userId: session.userId,
    role: session.role,
    sv: session.sv,
  });
  const expiresAt = new Date(Date.now() + SESSION_DURATION_SECONDS * 1000);

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, token, buildCookieOptions(expiresAt));

  return token;
}

/**
 * İstifadəçinin sessiyasını sonlandırır (cookie-ni silir).
 */
export async function destroySession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}
