// src/lib/lazy-prisma.ts
import type { PrismaClient } from '@prisma/client';

let prisma: PrismaClient | undefined;

export async function getPrisma() {
  if (!prisma) {
    const { PrismaClient } = await import('@prisma/client');
    prisma = new PrismaClient();
  }
  return prisma;
}
