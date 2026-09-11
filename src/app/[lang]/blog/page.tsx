import { redirectWithLocale } from "@/i18n/redirect";

/**
 * /blog ünvanı birbaşa məqalələr siyahısının yerləşdiyi ana səhifəyə yönləndirir
 */
export default async function BlogIndexPage() {
  await redirectWithLocale("/");
}
