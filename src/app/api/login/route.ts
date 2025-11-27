// @/app/api/login/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;

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

    // 🔑 Gera JWT com userId
    const token = jwt.sign({ userId: client.id }, JWT_SECRET, { expiresIn: "1d" });

    const response = NextResponse.json(
      { message: "Login successful", client: { id: client.id, name: client.name, email: client.email } },
      { status: 200 }
    );

    // Define cookie de sessão com JWT
    response.cookies.set("session", token, {
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
