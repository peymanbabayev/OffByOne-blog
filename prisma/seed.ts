import "dotenv/config";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const pool = new Pool({ connectionString: process.env.DIRECT_URL || process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const initialPosts = [
  {
    slug: "ilk-yazi",
    title: "İlk yazım",
    excerpt: "Bu, blogumun ilk yazısıdır.",
    content: "İlk yazımın ətraflı məzmunu burada olacaq. Next.js, Prisma və Neon PostgreSQL ilə öyrənmə yolumuz davam edir!",
  },
  {
    slug: "nextjs-oyrenirem",
    title: "Next.js öyrənirəm",
    excerpt: "Server Components və Prisma adapterləri maraqlıdır.",
    content: "Next.js App Router-də Server Components default olaraq gəlir. Prisma 7-nin pg adapteri vasitəsilə artıq real PostgreSQL bazası ilə birbaşa əlaqə qururuq.",
  },
];

async function main() {
  console.log("🌱 Verilənlər bazası toxumlanır (seeding)...");

  for (const post of initialPosts) {
    await prisma.post.upsert({
      where: { slug: post.slug },
      update: {},
      create: post,
    });
  }

  console.log("✅ Seed əməliyyatı uğurla tamamlandı!");
}

main()
  .catch((e) => {
    console.error("❌ Seed zamanı xəta baş verdi:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
