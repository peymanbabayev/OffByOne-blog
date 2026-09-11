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
import {
  locales,
  defaultLocale,
  isLocale,
  LOCALE_COOKIE_NAME,
  LOCALE_COOKIE_MAX_AGE,
  type Locale,
} from "@/i18n/config";

/**
 * Next.js 16 Proxy — YALNIZ OPTİMİSTİK yoxlama + dil (i18n) marşrutlaması.
 *
 * Node.js mühitində sorğular səhifələrə çatmamışdan əvvəl icra olunur; burada
 * yalnız cookie-dəki JWT-nin imzası və bitmə vaxtı yoxlanılır (DB sorğusu YOXDUR).
 *
 * ƏSL autentifikasiya/avtorizasiya sərhədi `src/lib/auth.ts` DAL-dır və hər
 * səhifə/Server Action daxilində çağırılmalıdır. Server Action-lar istifadə
 * olunduqları route-a POST kimi gedir — matcher həmin yolu istisna edərsə,
 * action-ın da proxy örtüyü itir. Ona görə qorunma action daxilində `requireAuth()`-dədir.
 *
 * Dil marşrutlaması (bax: Next.js "Internationalization" bələdçisi): hər yol
 * `/{locale}/...` prefiksi ilə açılmalıdır (`app/[lang]/...`). Prefiks yoxdursa,
 * istifadəçinin cookie-dəki seçimi (dil keçidindən) və ya `Accept-Language`
 * başlığı əsasında müəyyən edilib əlavə olunur.
 */

// Daxil olmuş istifadəçinin təkrar görməməli olduğu səhifələr (lokalsız)
const authRoutes = ["/login", "/register"];

// Yalnız daxil olmuş istifadəçilər üçün optimistik redirect (əsl qapı DAL-dadır)
const protectedRoutes = ["/new-post", "/edit-post"];

/** "en-US,en;q=0.5,az;q=0.3" -> ["en-us", "en", "az"] (keyfiyyətə görə sıralanmış). */
function parseAcceptLanguage(header: string | null): string[] {
  if (!header) return [];
  return header
    .split(",")
    .map((part) => {
      // RFC 7231 `;`/`=` ətrafında boşluğa icazə verir (`en; q=0.5`) — brauzerlər
      // adətən boşluqsuz göndərir, amma hər ehtimala qarşı `\s*` ilə tolerantlıq.
      const [tag, qPart] = part.trim().split(/;\s*q=/i);
      const q = qPart ? parseFloat(qPart) : 1;
      return { tag: tag.trim().toLowerCase(), q: Number.isNaN(q) ? 1 : q };
    })
    .sort((a, b) => b.q - a.q)
    .map((entry) => entry.tag);
}

/**
 * Cari dili müəyyən edir: əvvəlcə istifadəçinin əl ilə etdiyi seçim (cookie),
 * sonra brauzerin `Accept-Language` başlığı, sonra defolt dil.
 * (Yalnız 3 dil dəstəkləndiyi üçün tam `@formatjs/intl-localematcher`
 * kitabxanası əvəzinə yüngül, asılılıqsız uyğunlaşdırma kifayətdir.)
 */
function detectLocale(request: NextRequest): Locale {
  const cookieLocale = request.cookies.get(LOCALE_COOKIE_NAME)?.value;
  if (isLocale(cookieLocale)) return cookieLocale;

  for (const tag of parseAcceptLanguage(request.headers.get("accept-language"))) {
    if (isLocale(tag)) return tag;
    const base = tag.split("-")[0];
    if (isLocale(base)) return base;
  }

  return defaultLocale;
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // --- 1. Dil prefiksi yoxdursa: müəyyən edib əlavə et (redirect) ---
  const pathnameHasLocale = locales.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`)
  );

  if (!pathnameHasLocale) {
    const locale = detectLocale(request);
    const newUrl = new URL(
      `/${locale}${pathname === "/" ? "" : pathname}${request.nextUrl.search}`,
      request.url
    );
    const redirectResponse = NextResponse.redirect(newUrl);
    // İstifadəçi hələ heç bir dil seçməyibsə, avtomatik təyin olunan dili
    // cookie-yə yazırıq ki, naviqasiya boyu sabit qalsın.
    if (!isLocale(request.cookies.get(LOCALE_COOKIE_NAME)?.value)) {
      redirectResponse.cookies.set(LOCALE_COOKIE_NAME, locale, {
        path: "/",
        maxAge: LOCALE_COOKIE_MAX_AGE,
        sameSite: "lax",
      });
    }
    return redirectResponse;
  }

  // --- 2. Buradan sonra pathname həmişə "/{locale}/..." formasındadır ---
  const segments = pathname.split("/");
  const currentLocale = segments[1] as Locale;
  const pathWithoutLocale = "/" + segments.slice(2).join("/");

  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  const session = token ? await verifyToken(token) : null;

  const matches = (routes: string[]) =>
    routes.some((route) => pathWithoutLocale === route || pathWithoutLocale.startsWith(`${route}/`));

  // 3. Artıq daxil olub və /login | /register açır -> ana səhifəyə
  if (matches(authRoutes) && session) {
    return NextResponse.redirect(new URL(`/${currentLocale}`, request.url));
  }

  // 4. Daxil olmayıb və qorunan səhifəyə keçir -> /login (qayıdış yolu ilə)
  if (matches(protectedRoutes) && !session) {
    const loginUrl = new URL(`/${currentLocale}/login`, request.url);
    loginUrl.searchParams.set("from", sanitizeRedirectPath(pathWithoutLocale));
    return NextResponse.redirect(loginUrl);
  }

  const response = NextResponse.next();

  // 5. Sliding refresh: aktiv istifadəçinin tokeni ömrünün yarısını keçibsə yenilə
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
     * Aşağıdakılardan başqa bütün yollarda işləsin:
     * - _next/static, _next/image (Next.js-in öz daxili asset-ləri)
     * - /api (route handler-lər dil prefiksindən kənarda qalır)
     * - uzantısı olan istənilən yol (`.../*.*`) — `public/`-dəki statik
     *   fayllar (şəkillər, fontlar və s.), `favicon.ico`, `robots.txt`,
     *   `sitemap.xml` daxil. Konkret uzantı siyahısı saxlamaqdansa bu,
     *   `public/`-a yeni fayl növü əlavə edildikdə də etibarlı qalır.
     */
    "/((?!_next/static|_next/image|api|.*\\..*).*)",
  ],
};
