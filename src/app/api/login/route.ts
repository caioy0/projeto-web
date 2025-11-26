// @/app/api/login/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    const client = await prisma.user.findUnique({ where: { email } });

    if (!client) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    const passwordMatches = await bcrypt.compare(password, client.password);

    if (!passwordMatches) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    if (!client.active) {
      return NextResponse.json({ error: "Account not activated" }, { status: 403 });
    }

    // 🔑 Aqui você gera um token simples (pode ser JWT ou apenas o ID do usuário)
    const sessionToken = client.id.toString(); // exemplo simples, em produção use JWT

    const response = NextResponse.json(
      { message: "Login successful", client },
      { status: 200 }
    );

    // Define cookie de sessão
    response.cookies.set("session", sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24, // 1 dia
    });

    return response;
  } catch (error) {
    console.error("POST /api/auth/login error:", error);
    return NextResponse.json({ error: "Error logging in" }, { status: 500 });
  }
}
