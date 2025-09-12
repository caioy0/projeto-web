// src/lib/lazy-prisma.ts
import type { PrismaClient } from '@/generated/prisma';

let prisma: PrismaClient | undefined;

export async function getPrisma() {
  if (!prisma) {
    const { PrismaClient } = await import('@/generated/prisma');
    prisma = new PrismaClient();
  }
  return prisma;
}
