import { SignJWT, jwtVerify } from "jose";
import { z } from "zod";

/**
 * Edge/Node-neytral JWT primitivləri.
 *
 * Bu fayl bilərəkdən `server-only` və `next/headers`-dən istifadə ETMİR ki,
 * `src/proxy.ts` (Next.js 16 Proxy) tərəfindən import oluna bilsin.
 * Bütün imzalama və yoxlama məntiqi burada mərkəzləşdirilib; `session.ts` yalnız
 * cookie oxu/yaz əməliyyatları ilə məşğuldur.
 */

/**
 * Sessiya cookie-sinin adı (Vahid mənbə - Single Source of Truth).
 * Production-da `__Host-` prefiksi brauzeri məcbur edir ki, cookie yalnız
 * HTTPS üzərindən, `Path=/` ilə və `Domain` təyin edilmədən qəbul olunsun.
 */
export const SESSION_COOKIE_NAME =
  process.env.NODE_ENV === "production" ? "__Host-auth_token" : "auth_token";

/** Access tokenin ömrü: 2 gün (qısa ömür + proxy-də sliding refresh). */
export const SESSION_DURATION_SECONDS = 2 * 24 * 60 * 60;
const SESSION_EXPIRATION = "2d";

/**
 * Token daxilində imzaladığımız faktiki iddialar (claims).
 * Minimal məlumat: istifadəçi id-si, rolu və sessiya versiyası.
 * PII (e-poçt, ad və s.) VƏ YA həssas məlumat (parol) burada saxlanılmır.
 */
export const sessionClaimsSchema = z.object({
  userId: z.string().min(1),
  role: z.enum(["USER", "ADMIN"]),
  sv: z.number().int().nonnegative(),
});
export type SessionClaims = z.infer<typeof sessionClaimsSchema>;

/** Yoxlamadan sonra əldə etdiyimiz tam payload (jose `exp`/`iat` əlavə edir). */
const verifiedPayloadSchema = sessionClaimsSchema.extend({
  exp: z.number(),
  iat: z.number().optional(),
});
export type SessionPayload = z.infer<typeof verifiedPayloadSchema>;

/**
 * JWT gizli açarını oxuyur və UTF-8 bayt massivinə çevirir.
 * Fail-fast prinsipi: açar yoxdursa, tətbiq dərhal aydın xəta ilə dayanır.
 */
function getEncodedJwtSecret(): Uint8Array {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.trim().length === 0) {
    throw new Error(
      "KRİTİK TƏHLÜKƏSİZLİK XƏTASI: JWT_SECRET mühit dəyişəni (.env) təyin edilməyib!"
    );
  }
  return new TextEncoder().encode(secret);
}

export const encodedKey = getEncodedJwtSecret();

/**
 * Verilmiş iddialar üçün HS256 ilə imzalanmış yeni JWT yaradır.
 */
export async function signToken(
  claims: SessionClaims,
  expiresIn: string = SESSION_EXPIRATION
): Promise<string> {
  return new SignJWT({ ...claims })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .sign(encodedKey);
}

/**
 * JWT tokenini yoxlayır və payload-u qaytarır.
 * Token etibarsızdırsa, vaxtı keçibsə, saxtadırsa VƏ YA payload gözlənilən
 * formada deyilsə, təhlükəsiz şəkildə `null` qaytarır.
 */
export async function verifyToken(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, encodedKey, {
      algorithms: ["HS256"],
    });
    const parsed = verifiedPayloadSchema.safeParse(payload);
    return parsed.success ? parsed.data : null;
  } catch {
    return null;
  }
}

/**
 * Tokenin ömrünün yarısından çoxu keçibsə `true` qaytarır —
 * proxy bu halda aktiv istifadəçi üçün cookie-ni yenidən verir (sliding refresh).
 */
export function shouldRefresh(payload: SessionPayload): boolean {
  const remainingMs = payload.exp * 1000 - Date.now();
  return remainingMs < (SESSION_DURATION_SECONDS * 1000) / 2;
}
