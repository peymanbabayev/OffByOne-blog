import { Post } from "@/types/post";

const posts: Post[] = [
  {
    slug: "ilk-yazi",
    title: "İlk yazım",
    excerpt: "Bu, blogumun ilk yazısıdır.",
    content: "İlk yazımın ətraflı məzmunu burada olacaq...",
    date: "2025-05-10",
  },
  {
    slug: "nextjs-oyrenirem",
    title: "Next.js öyrənirəm",
    excerpt: "Server Components maraqlıdır.",
    content: "Next.js App Router və Server Components haqqında qeydlər...",
    date: "2025-05-12",
  },
];

export async function getPosts(): Promise<Post[]> {
  // Gələcəkdə bura verilənlər bazası və ya xarici API sorğusu olacaq
  return posts;
}
