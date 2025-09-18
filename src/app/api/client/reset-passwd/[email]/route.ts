// @/app/api/client/reset-password/[email]/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import nodemailer from "nodemailer";
import crypto from "crypto";

export async function GET(
  req: Request,
  context: { params: Promise<{ email: string }> }
) {
  try {
    const { email } = await context.params;

    const client = await prisma.user.findUnique({ where: { email } });

    if (!client) {
      return NextResponse.json({ error: "Email not found" }, { status: 404 });
    }

    // Gera token temporário
    const resetToken = crypto.randomBytes(32).toString("hex");

    await prisma.user.update({
      where: { email },
      data: { resetToken, resetTokenExpiry: new Date(Date.now() + 3600 * 1000) }, // expira em 1h
    });

    // Configura transporte de email (usando env SMTP)
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const resetLink = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password/${resetToken}`;

    await transporter.sendMail({
      from: `"CloudGames" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "Redefinição de senha",
      html: `<p>Olá ${client.name},</p>
             <p>Clique no link abaixo para redefinir sua senha:</p>
             <a href="${resetLink}">${resetLink}</a>
             <p>O link expira em 1 hora.</p>`,
    });

    return NextResponse.json({ message: "Password reset email sent" }, { status: 200 });
  } catch (error) {
    console.error("GET /api/client/reset-password/[email] error:", error);
    return NextResponse.json({ error: "Error sending reset password email" }, { status: 500 });
  }
}
