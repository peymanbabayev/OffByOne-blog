import "dotenv/config";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { getPasswordSchema } from "../src/lib/validations/auth";
import az from "../src/i18n/dictionaries/az";

const passwordSchema = getPasswordSchema(az);

const pool    = new Pool({ connectionString: process.env.DIRECT_URL || process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma  = new PrismaClient({ adapter });

/**
 * Admin hesabını yalnız `SEED_ADMIN_EMAIL` + `SEED_ADMIN_PASSWORD` mühit
 * dəyişənləri əsasında yaradır. Hardcoded kredensial yoxdur.
 * - Production-da bu dəyişənlər yoxdursa skript dayanır.
 * - Digər mühitlərdə xəbərdarlıq verib admin yaratmadan davam edir.
 */

async function seedAdmin(): Promise<string | null> {
  const email = process.env.SEED_ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.SEED_ADMIN_PASSWORD;

  if (!email || !password) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("SEED_ADMIN_EMAIL və SEED_ADMIN_PASSWORD mühit dəyişənləri təyin edilməlidir.");
    }
    console.warn("⚠️  SEED_ADMIN_EMAIL / SEED_ADMIN_PASSWORD təyin edilməyib — admin hesabı yaradılmır.");
    return null;
  }

  const parsed = passwordSchema.safeParse(password);
  if (!parsed.success) {
    throw new Error(`SEED_ADMIN_PASSWORD parol siyasətinə uyğun deyil: ${parsed.error.issues.map((i) => i.message).join(", ")}`);
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const adminUser = await prisma.user.upsert({
    where: { email },
    update: { role: "ADMIN" },
    create: {
      name: process.env.SEED_ADMIN_NAME?.trim() || "Peyman Babayev",
      email,
      password: passwordHash,
      role: "ADMIN",
    },
  });
  console.log(`👤 Admin istifadəçisi hazırdır: ${adminUser.email} (Rol: ${adminUser.role})`);
  return adminUser.id;
}

async function main() {
  await seedAdmin();
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
