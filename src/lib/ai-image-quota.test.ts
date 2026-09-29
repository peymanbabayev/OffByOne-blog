import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

type Row = { id: string; userId: string; createdAt: Date };
type Where = { id?: string; userId?: string; createdAt?: { gte: Date } };

const rows: Row[] = [];
const matches = (row: Row, where: Where) =>
  (where.id === undefined || row.id === where.id) &&
  (where.userId === undefined || row.userId === where.userId) &&
  (where.createdAt === undefined || row.createdAt >= where.createdAt.gte);

vi.mock("@/lib/prisma", () => {
  const client = {
    $executeRaw: vi.fn(async () => 0),
    aiImageGeneration: {
      count: vi.fn(async ({ where }: { where: Where }) => rows.filter((r) => matches(r, where)).length),
      create: vi.fn(async ({ data }: { data: { userId: string } }) => {
        const row = { id: `gen-${rows.length + 1}`, userId: data.userId, createdAt: new Date(NOW) };
        rows.push(row);
        return { id: row.id };
      }),
      deleteMany: vi.fn(async ({ where }: { where: Where }) => {
        const before = rows.length;
        for (let i = rows.length - 1; i >= 0; i--) if (matches(rows[i], where)) rows.splice(i, 1);
        return { count: before - rows.length };
      }),
    },
    $transaction: vi.fn(async (fn: (tx: unknown) => unknown) => fn(client)),
  };
  return { prisma: client };
});

const NOW = "2026-09-29T15:00:00Z";

const { reserveGeneration, refundGeneration } = await import("./ai-image-quota");

describe("ai-image-quota", () => {
  beforeEach(() => {
    rows.length = 0;
    vi.stubEnv("AI_IMAGE_DAILY_LIMIT_PER_USER", "2");
    vi.stubEnv("AI_IMAGE_DAILY_LIMIT_GLOBAL", "3");
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("istifadəçi və qlobal gündəlik limit aşıldıqda rezervi rədd edir, dünənki istifadəni saymır", async () => {
    const now = new Date(NOW);
    rows.push({ id: "old", userId: "alice", createdAt: new Date("2026-09-28T23:59:59Z") });

    expect(await reserveGeneration("alice", now)).toMatchObject({ ok: true, remaining: 1 });
    expect(await reserveGeneration("alice", now)).toMatchObject({ ok: true, remaining: 0 });
    expect(await reserveGeneration("alice", now)).toEqual({ ok: false, reason: "user_limit", limit: 2 });

    expect(await reserveGeneration("bob", now)).toMatchObject({ ok: true });
    expect(await reserveGeneration("carol", now)).toEqual({ ok: false, reason: "global_limit", limit: 3 });

    expect(rows.filter((r) => r.id !== "old")).toHaveLength(3);
  });

  it("refund sətri silir və istifadəçiyə haqqını geri qaytarır", async () => {
    const now = new Date(NOW);
    await reserveGeneration("alice", now);
    const second = await reserveGeneration("alice", now);
    expect(await reserveGeneration("alice", now)).toMatchObject({ ok: false, reason: "user_limit" });

    if (!second.ok) throw new Error("gözlənilməz: ikinci rezerv uğursuz oldu");
    await refundGeneration(second.generationId);

    expect(rows.some((r) => r.id === second.generationId)).toBe(false);
    expect(await reserveGeneration("alice", now)).toMatchObject({ ok: true, remaining: 0 });
  });
});
