import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";
import { locales, defaultLocale } from "@/i18n/config";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

/** Hər lokal üçün eyni yolun `hreflang` alternativlərini qurur (+ `x-default`). */
function withLanguageAlternates(path: string) {
  return {
    languages: {
      ...Object.fromEntries(locales.map((locale) => [locale, `${SITE_URL}/${locale}${path}`])),
      "x-default": `${SITE_URL}/${defaultLocale}${path}`,
    },
  };
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await prisma.post.findMany({
    select: { slug: true, updatedAt: true },
    orderBy: { updatedAt: "desc" },
  });

  // Məqalə məzmunu (başlıq/mətn) lokala görə tərcümə OLUNMUR — yalnız UI xromu
  // dəyişir. Ona görə `/en/blog/x`, `/ru/blog/x` `hreflang` alternativi kimi
  // GÖSTƏRİLMİR (bunlar eyni məzmunun dublikatları olardı); yalnız tək,
  // kanonik (defolt dil) ünvan sitemap-ə düşür (bax: page.tsx-dəki `canonical`).
  const postEntries: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${SITE_URL}/${defaultLocale}/blog/${post.slug}`,
    lastModified: post.updatedAt,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [
    {
      url: `${SITE_URL}/${defaultLocale}`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
      alternates: withLanguageAlternates(""),
    },
    {
      url: `${SITE_URL}/${defaultLocale}/about`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
      alternates: withLanguageAlternates("/about"),
    },
    ...postEntries,
  ];
}
