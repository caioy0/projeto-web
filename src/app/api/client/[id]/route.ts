// @/app/api/order/client/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { ObjectId } from "mongodb";

// GET - Buscar usuário por ID
export async function GET(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { id },
      include: { orders: true, Cart: true },
    });

    if (!user) {
      return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 });
    }

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.error("GET /api/user/[id] error:", error);
    return NextResponse.json({ error: "Erro ao buscar usuário" }, { status: 500 });
  }
}

// PUT - Alterar dados do usuário
export async function PUT(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 });
    }

    const body = await req.json();

    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        name: body.name ?? undefined,
        email: body.email ?? undefined,
        password: body.password ?? undefined,
        age: body.age ?? undefined,
        active: body.active ?? undefined,
        role: body.role ?? undefined,
      },
    });

    return NextResponse.json(updatedUser, { status: 200 });
  } catch (error) {
    console.error("PUT /api/user/[id] error:", error);
    return NextResponse.json({ error: "Erro ao atualizar usuário" }, { status: 500 });
  }
}

// DELETE - Deletar usuário
export async function DELETE(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 });
    }

    const deletedUser = await prisma.user.delete({
      where: { id },
    });

    return NextResponse.json({ message: `Usuário ${deletedUser.name} deletado com sucesso` }, { status: 200 });
  } catch (error) {
    console.error("DELETE /api/user/[id] error:", error);
    return NextResponse.json({ error: "Erro ao deletar usuário" }, { status: 500 });
  }
}