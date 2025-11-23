// src/lib/auth.ts
'use server';

import { SignJWT, jwtVerify } from 'jose';
import bcrypt from 'bcryptjs';
import type { LoginUserInput, RegisterUserInput } from '@/types';
import { getPrisma } from './lazy-prisma';

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) throw new Error('⚠️ JWT_SECRET environment variable is missing!');

// --- Utility Functions ---
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(plainText: string, hashed: string) {
  return bcrypt.compare(plainText, hashed);
}

export async function createToken(payload: { userId: string }) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('7d')
    .sign(new TextEncoder().encode(JWT_SECRET!));
}

export async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(JWT_SECRET!));
    return payload as { userId: string };
  } catch {
    return null;
  }
}

// --- Core Auth ---
export async function registerUser(userData: RegisterUserInput) {
  const prisma = await getPrisma();
  const { email, password, name } = userData;

  const existingUser = await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
  });
  if (existingUser) throw new Error('A user with this email already exists.');

  const hashedPassword = await hashPassword(password);

  return prisma.user.create({
    data: { email: email.toLowerCase(), name, password: hashedPassword },
    select: { id: true, email: true, name: true },
  });
}

export async function loginUser(credentials: LoginUserInput) {
  const prisma = await getPrisma();
  const { email, password } = credentials;

  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
  });
  if (!user) throw new Error('Invalid email or password.');

  const isValid = await verifyPassword(password, user.password);
  if (!isValid) throw new Error('Invalid email or password.');

  const token = await createToken({ userId: user.id });

  return { token, user: { id: user.id, email: user.email, name: user.name } };
}

export async function getCurrentUser(token: string | undefined) {
  if (!token) return null;
  const decoded = await verifyToken(token);
  if (!decoded) return null;

  const prisma = await getPrisma();
  return prisma.user.findUnique({
    where: { id: decoded.userId },
    select: { id: true, email: true, name: true },
  });
}

