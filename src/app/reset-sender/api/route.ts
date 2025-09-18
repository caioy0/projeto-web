import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();
    const resend = new Resend(process.env.RESEND_API_KEY);
    const activationToken = crypto.randomBytes(32).toString('hex');
    const resetLink = `http://localhost:3000/reset-password?token=${activationToken}`

    const htmlContent = `
  <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111827; max-width: 600px; margin: auto; padding: 20px;">
    <h1 style="color: #0f172a;">Olá! 👋</h1>
    <p>
      Recebemos uma solicitação para redefinir a sua senha da sua conta no <strong>CloudGames</strong>.
      Clique no botão abaixo para continuar o processo de recuperação:
    </p>

    <a
      href="${resetLink}"
      style="
        display: inline-block;
        padding: 12px 20px;
        background-color: #f97316;
        color: #ffffff;
        border-radius: 6px;
        text-decoration: none;
        font-weight: bold;
        margin-top: 12px;
      "
    >
      Redefinir senha
    </a>

    <p style="font-size: 14px; margin-top: 20px; color: #6b7280;">
      Se o botão acima não funcionar, copie e cole este link no seu navegador:
    </p>
    <p style="font-size: 13px; color: #0f62fe; word-break: break-word;">
      ${resetLink}
    </p>

    <hr style="margin: 20px 0; border: none; border-top: 1px solid #e5e7eb;" />

    <p style="font-size: 12px; color: #9ca3af;">
      Caso você não tenha solicitado a redefinição de senha, ignore este email.
    </p>

    <p style="font-size: 12px; color: #9ca3af; margin-top: 10px;">
      Este link expira em 1 hora por motivos de segurança.
    </p>
  </div>
`;

    // Validate input
    if (!email) {
      return NextResponse.json(
        { message: 'email é necessario'},
        { status: 400 }
      );
    }
    // valida usuario na base
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (!existingUser) {
      return NextResponse.json(
        { message: 'email não encontrado na nossa base' },
        { status: 409 }
      );
    }

    await prisma.user.update({
      where: { email },
      data: {
        activationToken: activationToken,
      }
    });

    await resend.emails.send({
      from: 'cloudgames <onboarding@resend.dev>',
      to: [email],
      subject: 'Redefinição de senha',
      html: htmlContent
    });

    return NextResponse.json(
      { message: 'Email para reset senha enviado!', user: { email } },
      { status: 201 }
    );
  } catch (err) {
    return NextResponse.json(
      { error: 'Erro interno do servidor.' },
      { status: 500 }
    );
  }
}