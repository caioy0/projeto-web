// src/lib/prisma.ts
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

// Add middleware for logging
// prisma.$use(async (params, next) => {
//   const before = Date.now();
//   const result = await next(params);
//   const after = Date.now();
  
//   console.log(`Query ${params.model}.${params.action} took ${after - before}ms`);
  
//   return result;
// });

// Add error formatting middleware
// prisma.$use(async (params, next) => {
//   try {
//     return await next(params);
//   } catch (error) {
//     console.error('Prisma error:', error);
//     throw error;
//   }
// });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

// Export custom types
//export type { User, Post, Profile } from '@prisma/client';