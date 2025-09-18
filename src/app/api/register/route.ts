// @/app/api/register/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import nodemailer from 'nodemailer';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Name, email, and password are required' },
        { status: 400 }
      );
    }

    // Hash da senha antes de salvar
    const hashedPassword = await bcrypt.hash(password, 10);

    // Gera token de ativação único
    const activationToken = crypto.randomBytes(32).toString('hex');

    // Cria o usuário no banco com active: false
    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        active: false, // não ativo ainda
        activationToken,
      },
    });

    // Configura o transporte de email usando variáveis de ambiente
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // Link de ativação
    const activationLink = `${process.env.NEXT_PUBLIC_APP_URL}/activate/${activationToken}`;

    // Envia o email de ativação
    await transporter.sendMail({
      from: `"CloudGames" <${process.env.SMTP_USER}>`,
      to: email,
      subject: 'Confirmação de Cadastro',
      html: `<p>Olá ${name},</p>
             <p>Seu cadastro foi realizado com sucesso!</p>
             <p>Clique no link abaixo para ativar sua conta:</p>
             <a href="${activationLink}">${activationLink}</a>`,
    });

    return NextResponse.json(
      { message: 'User registered successfully. Check your email to activate the account.' },
      { status: 201 }
    );

  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
