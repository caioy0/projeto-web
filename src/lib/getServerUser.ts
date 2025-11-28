// @/lib/getServerUser.ts
import { cookies } from "next/headers";
import prisma from "@/lib/prisma";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;

export async function getServerUser() {
  const cookieStore = cookies();
  const sessionToken = (await cookieStore).get("session")?.value;
  if (!sessionToken) return null;

  try {
    // Decodifica o token e extrai o userId
    const payload = jwt.verify(sessionToken, JWT_SECRET) as { userId: string };

    // Busca o usuário pelo ID extraído do token
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: { id: true, email: true, name: true, active: true },
    });

    return user && user.active ? user : null;
  } catch (error) {
    console.error("Erro ao validar token:", error);
    return null;
  }
}
