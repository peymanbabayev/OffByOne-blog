import { redirect } from "next/navigation";

/**
 * /blog ünvanı birbaşa məqalələr siyahısının yerləşdiyi ana səhifəyə yönləndirir
 */
export default function BlogIndexPage() {
  redirect("/");
}
