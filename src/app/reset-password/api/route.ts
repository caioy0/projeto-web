import { NextRequest, NextResponse } from 'next/server';
import Prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const token = url.searchParams.get('token');

    if (!token) {
      return NextResponse.json(
        { valid: false, message: 'Token is required' },
        { status: 400 }
      );
    }

    // Verifica se o token existe e ainda é válido
    const user = await Prisma.user.findFirst({
      where: { 
        activationToken: token
      }
    });

    if (!user) {
      return NextResponse.json(
        { valid: false, message: 'Invalid or expired token' },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      valid: true, 
      message: 'Token valid', 
      email: user.email 
    });

  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { valid: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
export async function PUT(request: NextRequest) {
  try {
    const { token, newPassword } = await request.json();

    if (!token || !newPassword) {
      return NextResponse.json(
        { error: "Token e nova senha são obrigatórios." },
        { status: 400 }
      );
    }

    // Valida tamanho mínimo da senha
    if (newPassword.length < 6) {
      return NextResponse.json(
        { error: "A senha deve ter pelo menos 6 caracteres." },
        { status: 400 }
      );
    }

    // Busca o usuário pelo token
    const user = await Prisma.user.findFirst({
      where: { activationToken: token }
    });

    if (!user?.activationToken) {
      return NextResponse.json(
        { error: "Token inválido." },
        { status: 404 }
      );
    }

    // Gera hash da nova senha
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Atualiza a senha e limpa o token
    await Prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        activationToken: null,
      }
    });

    return NextResponse.json(
      { message: "Senha atualizada com sucesso!" },
      { status: 200 }
    );

  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Erro interno do servidor." },
      { status: 500 }
    );
  }
}