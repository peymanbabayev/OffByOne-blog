"use client";

import NextLink from "next/link";
import type { ComponentProps } from "react";
import { useLang } from "./client";
import { locales, type Locale } from "./config";

type NextLinkProps = ComponentProps<typeof NextLink>;

/**
 * Prefixes an internal absolute path (`/blog/foo`) with the current locale
 * (`/en/blog/foo`). Leaves external URLs, hashes, protocol-relative URLs,
 * relative paths, and already-locale-prefixed paths untouched. Exported so
 * client code that isn't rendering `<Link>` (e.g. `router.push`,
 * `history.replaceState`) can reuse the same rule.
 */
export function localizeHref(href: string, lang: Locale): string {
  if (href.startsWith("//")) return href;
  if (/^[a-z][a-z0-9+.-]*:/i.test(href)) return href;
  if (href.startsWith("#")) return href;
  if (!href.startsWith("/")) return href;
  const hasLocalePrefix = locales.some((l) => href === `/${l}` || href.startsWith(`/${l}/`));
  if (hasLocalePrefix) return href;
  return `/${lang}${href}`;
}

function withLocale(href: NextLinkProps["href"], lang: Locale): NextLinkProps["href"] {
  if (typeof href !== "string") return href;
  return localizeHref(href, lang);
}

/**
 * Drop-in replacement for `next/link`'s `Link` that automatically localizes
 * internal hrefs. Import this instead of `next/link` throughout the app —
 * it's a Client Component (same as the `next/link` it wraps), so it renders
 * fine from Server Components too.
 */
export default function Link({ href, ...props }: NextLinkProps) {
  const lang = useLang();
  return <NextLink href={withLocale(href, lang)} {...props} />;
}
