import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextResponse, type NextRequest } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { IMAGE_CONTENT_TYPES, MAX_IMAGE_BYTES, isImageKind } from "@/lib/image";
import { LOCALE_COOKIE_NAME, toLocale } from "@/i18n/config";
import { getDictionaryFor } from "@/i18n/dictionaries";

/**
 * Client-upload token route-u (layihədə ilk `/api` route-u).
 *
 * Fayl brauzerdən birbaşa Vercel Blob-a yüklənir — bu route yalnız:
 *  1. istifadəçini autentifikasiya edir (`getCurrentUser` — əsl DAL),
 *  2. icazəli tip/ölçü məhdudiyyəti ilə qısamüddətli yükləmə token-i verir.
 *
 * DB yazısı BURADA baş vermir — nəticə URL-i formaya qayıdır və mövcud
 * `createPostAction` / `updatePostAction` / `updateAvatarAction` onu adi mətn
 * sahəsi kimi saxlayır. (`onUploadCompleted` localhost-da işləmədiyi üçün ona
 * güvənmirik.)
 *
 * Route Handler-lər `next/root-params` istifadə edə bilmədiyi üçün (Next.js
 * i18n bələdçisi) dil `NEXT_LOCALE` cookie-sindən oxunur.
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  const lang = toLocale(request.cookies.get(LOCALE_COOKIE_NAME)?.value);
  const dict = getDictionaryFor(lang);

  // Erkən qapı: token konfiqurasiyasından asılı olmayaraq təmiz 401.
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json(
      { error: dict.uploadActions.mustBeLoggedIn },
      { status: 401 }
    );
  }

  const body = (await request.json()) as HandleUploadBody;

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (_pathname, clientPayload) => {
        const kind = isImageKind(clientPayload) ? clientPayload : "cover";

        // Qovluğa ayırma (covers/… , avatars/…) client-in verdiyi `pathname`-dədir;
        // `addRandomSuffix` toqquşmaların qarşısını alır, auth + tip + ölçü burada tətbiq olunur.
        return {
          addRandomSuffix: true,
          allowedContentTypes: [...IMAGE_CONTENT_TYPES],
          maximumSizeInBytes: MAX_IMAGE_BYTES,
          tokenPayload: JSON.stringify({ userId: user.id, kind }),
        };
      },
      onUploadCompleted: async () => {
        // Bilərəkdən boş — DB yazısı Server Action-larda aparılır.
      },
    });

    return NextResponse.json(jsonResponse);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : dict.uploadActions.uploadFailed },
      { status: 400 }
    );
  }
}
