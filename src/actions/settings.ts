// @/actions/settings.ts
'use server';

import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET!;

// Helper: pegar usuário logado
async function getCurrentUser() {
  const token = (await cookies()).get('token')?.value;
  if (!token) return null;

  try {
    const payload = jwt.verify(token, JWT_SECRET) as { userId: string };
    const user = await prisma.user.findUnique({ where: { id: payload.userId } });
    return user;
  } catch {
    return null;
  }
}

// Atualizar dados do usuário (nome/email)
export async function updateUserSettings(data: { name?: string; email?: string }) {
  const user = await getCurrentUser();
  if (!user) throw new Error('Usuário não autenticado');

  const updatedUser = await prisma.user.update({
    where: { id: user.id },
    data: {
      name: data.name ?? user.name,
      email: data.email ?? user.email,
    },
  });

  return updatedUser;
}

// Alterar senha
export async function updateUserPassword(data: { currentPassword: string; newPassword: string }) {
  const user = await getCurrentUser();
  if (!user) throw new Error('Usuário não autenticado');

  const valid = await bcrypt.compare(data.currentPassword, user.password);
  if (!valid) throw new Error('Senha atual incorreta');

  const hashedPassword = await bcrypt.hash(data.newPassword, 10);

    await prisma.user.update({
    where: { id: user.id },
    data: { password: hashedPassword },
  });

  return { message: 'Senha alterada com sucesso' };
}

// Ativar/Desativar usuário
export async function toggleUserActive() {
  const user = await getCurrentUser();
  if (!user) throw new Error('Usuário não autenticado');

  const updatedUser = await prisma.user.update({
    where: { id: user.id },
    data: { active: !user.active },
  });

  return updatedUser;
}
