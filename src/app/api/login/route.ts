// @/app/api/auth/login/route.ts
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

    // Verifica se senha bate (hashing recomendado em produção)
    const passwordMatches = await bcrypt.compare(password, client.password);

    if (!passwordMatches) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    if (!client.active) {
      return NextResponse.json({ error: "Account not activated" }, { status: 403 });
    }

    return NextResponse.json({ message: "Login successful", client }, { status: 200 });
  } catch (error) {
    console.error("POST /api/auth/login error:", error);
    return NextResponse.json({ error: "Error logging in" }, { status: 500 });
  }
}
