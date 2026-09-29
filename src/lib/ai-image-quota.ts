import "server-only";

import { prisma } from "@/lib/prisma";

/**
 * AI şəkil generasiyası üçün gündəlik kvota (UTC günü üzrə).
 * - İstifadəçi başına limit: istifadəçinin gündəlik haqqı.
 * - Qlobal limit: Cloudflare-in pulsuz gündəlik neuron kvotasını qoruyur
 *   (bir generasiya ≈ 61 neuron; 60 × 61 ≈ 3 700, 10 000 kvotanın ~37%-i).
 * Hər uğurlu rezerv bir `AiImageGeneration` sətridir; generasiya uğursuz olarsa sətir silinir (refund).
 */

const DEFAULT_PER_USER_LIMIT = 2;
const DEFAULT_GLOBAL_LIMIT = 60;

// Bütün rezervləri ardıcıllaşdırır ki, paralel sorğular nə istifadəçi, nə də qlobal limiti aşa bilməsin.
const QUOTA_LOCK_KEY = 724_001;

function readLimit(value: string | undefined, fallback: number): number {
  const parsed = Number.parseInt(value ?? "", 10);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : fallback;
}

export function getDailyLimits(): { perUser: number; global: number } {
  return {
    perUser: readLimit(process.env.AI_IMAGE_DAILY_LIMIT_PER_USER, DEFAULT_PER_USER_LIMIT),
    global: readLimit(process.env.AI_IMAGE_DAILY_LIMIT_GLOBAL, DEFAULT_GLOBAL_LIMIT),
  };
}

export function startOfUtcDay(now: Date): Date {
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
}

export type ReserveResult =
  | { ok: true; generationId: string; remaining: number }
  | { ok: false; reason: "user_limit" | "global_limit"; limit: number };

export async function reserveGeneration(userId: string, now: Date = new Date()): Promise<ReserveResult> {
  const { perUser, global } = getDailyLimits();
  const since = startOfUtcDay(now);

  return prisma.$transaction(async (tx) => {
    await tx.$executeRaw`SELECT pg_advisory_xact_lock(${QUOTA_LOCK_KEY}::bigint)`;

    const userCount = await tx.aiImageGeneration.count({
      where: { userId, createdAt: { gte: since } },
    });
    if (userCount >= perUser) {
      return { ok: false, reason: "user_limit", limit: perUser };
    }

    const globalCount = await tx.aiImageGeneration.count({
      where: { createdAt: { gte: since } },
    });
    if (globalCount >= global) {
      return { ok: false, reason: "global_limit", limit: global };
    }

    const row = await tx.aiImageGeneration.create({
      data: { userId },
      select: { id: true },
    });
    return { ok: true, generationId: row.id, remaining: perUser - userCount - 1 };
  });
}

/** Uğursuz generasiyadan sonra istifadəçinin haqqını geri qaytarır. */
export async function refundGeneration(generationId: string): Promise<void> {
  await prisma.aiImageGeneration.deleteMany({ where: { id: generationId } });
}
