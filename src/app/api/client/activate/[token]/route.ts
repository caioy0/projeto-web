// @/app/api/client/activate/[token]/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PATCH(
  req: Request,
  context: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await context.params;

    // Aqui você precisaria ter salvo um token no banco associado ao usuário
    const client = await prisma.user.findFirst({ where: { activationToken: token } });

    if (!client) {
      return NextResponse.json({ error: "Invalid or expired activation link" }, { status: 400 });
    }

    const updatedClient = await prisma.user.update({
      where: { id: client.id },
      data: { active: true, activationToken: null },
    });

    return NextResponse.json({ message: "Client activated successfully", updatedClient }, { status: 200 });
  } catch (error) {
    console.error("PATCH /api/client/activate/[token] error:", error);
    return NextResponse.json({ error: "Error activating client" }, { status: 500 });
  }
}
