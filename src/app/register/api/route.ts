import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma';
import crypto from 'crypto';
import nodemailer from 'nodemailer';

export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json();
    const activationToken = crypto.randomBytes(32).toString('hex');
    const accessLink = `http://localhost:3000/active?token=${activationToken}`;
    const htmlContent = `
  <div style="font-family:Arial,sans-serif;line-height:1.6;color:#111827">
    <h1>Olá, ${name}! 👋</h1>
    <p>Obrigado por criar sua conta na <strong>CloudGames</strong>. Ative sua conta clicando abaixo:</p>
    <a href="${accessLink}" style="display:inline-block;padding:12px 20px;background-color:#0f62fe;color:#fff;border-radius:6px;text-decoration:none;font-weight:bold;margin-top:12px;">
      Ativar minha conta
    </a>
    <p style="font-size: 14px; margin-top: 20px; color: #6b7280;">
      Se o botão acima não funcionar, copie e cole este link no seu navegador:
    </p>
    <p style="font-size: 13px; color: #0f62fe; word-break: break-word;">
      ${accessLink}
    </p>    
    <p style="font-size: 12px; color: #9ca3af; margin-top: 10px;">
      Este link expira em 1 hora por motivos de segurança.
    </p>
  </div>
`;

    // Validate input
    if (!name || !email || !password) {
      return NextResponse.json(
        { message: 'Name, email, and password are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { message: 'Please provide a valid email address' },
        { status: 400 }
      );
    }

    // Validate password strength
    if (password.length < 6) {
      return NextResponse.json(
        { message: 'Password must be at least 6 characters long' },
        { status: 400 }
      );
    }

    // valida usuario na base
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: 'User already exists with this email' },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Configura transporte do Nodemailer
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST, // ex: smtp.gmail.com
      port: Number(process.env.SMTP_PORT) || 587,
      secure: false, // true para 465, false para outros
      auth: {
        user: process.env.SMTP_USER, // seu email
        pass: process.env.SMTP_PASS, // sua senha ou App Password
      },
    });

    // Enviar e-mail
    await transporter.sendMail({
      from: `"CloudGames" <${process.env.SMTP_USER}>`,
      to: email,
      subject: 'Primeiro acesso',
      html: htmlContent,
    });

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        activationToken,
      },
    });

    return NextResponse.json(
      {
        message: 'Usuário criado com sucesso!',
        user: { id: user.id, name: user.name, email: user.email },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('POST /register/api error:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor.' },
      { status: 500 }
    );
  }
}

// GET -> listar usuários
export async function GET() {
  try {
    const users = await prisma.user.findMany();
    return NextResponse.json(users, { status: 200 });
  } catch (error) {
    console.error('GET /register/api error:', error);
    return NextResponse.json({ error: 'Erro ao buscar usuários.' }, { status: 500 });
  }
}
