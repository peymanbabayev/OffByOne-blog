import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  verifyToken,
  signToken,
  shouldRefresh,
  SESSION_COOKIE_NAME,
  SESSION_DURATION_SECONDS,
} from "@/lib/jwt";
import { sanitizeRedirectPath } from "@/lib/redirects";

/**
 * Next.js 16 Proxy — YALNIZ OPTİMİSTİK yoxlama.
 *
 * Node.js mühitində sorğular səhifələrə çatmamışdan əvvəl icra olunur; burada
 * yalnız cookie-dəki JWT-nin imzası və bitmə vaxtı yoxlanılır (DB sorğusu YOXDUR).
 *
 * ƏSL autentifikasiya/avtorizasiya sərhədi `src/lib/auth.ts` DAL-dır və hər
 * səhifə/Server Action daxilində çağırılmalıdır. Server Action-lar istifadə
 * olunduqları route-a POST kimi gedir — matcher həmin yolu istisna edərsə,
 * action-ın da proxy örtüyü itir. Ona görə qorunma action daxilində `requireAuth()`-dədir.
 */

// Daxil olmuş istifadəçinin təkrar görməməli olduğu səhifələr
const authRoutes = ["/login", "/register"];

// Yalnız daxil olmuş istifadəçilər üçün optimistik redirect (əsl qapı DAL-dadır)
const protectedRoutes = ["/new-post"];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  const session = token ? await verifyToken(token) : null;

  const matches = (routes: string[]) =>
    routes.some((route) => pathname === route || pathname.startsWith(`${route}/`));

  // 1. Artıq daxil olub və /login | /register açır -> ana səhifəyə
  if (matches(authRoutes) && session) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // 2. Daxil olmayıb və qorunan səhifəyə keçir -> /login (qayıdış yolu ilə)
  if (matches(protectedRoutes) && !session) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("from", sanitizeRedirectPath(pathname));
    return NextResponse.redirect(loginUrl);
  }

  const response = NextResponse.next();

  // 3. Sliding refresh: aktiv istifadəçinin tokeni ömrünün yarısını keçibsə yenilə
  if (session && shouldRefresh(session)) {
    const fresh = await signToken({
      userId: session.userId,
      role: session.role,
      sv: session.sv,
    });
    response.cookies.set(SESSION_COOKIE_NAME, fresh, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: SESSION_DURATION_SECONDS,
    });
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Aşağıdakı statik və sistem fayllarından başqa bütün yollarda işləsin:
     * - _next/static, _next/image, favicon.ico və ictimai media formatları
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
