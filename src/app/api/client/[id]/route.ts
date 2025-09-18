// @/app/api/order/client/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { ObjectId } from "mongodb";

// GET - Buscar pedidos do cliente por ID
export async function GET(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;

    // Validar ObjectId
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 });
    }

    const orders = await prisma.order.findMany({
      where: { userId: id },
      include: {
        user: true,
        items: {
          include: {
            product: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    if (!orders.length) {
      return NextResponse.json({ error: "Nenhum pedido encontrado para este cliente" }, { status: 404 });
    }

    return NextResponse.json(orders, { status: 200 });
  } catch (error) {
    console.error("GET /api/order/client/[id] error:", error);
    return NextResponse.json({ error: "Erro ao buscar pedidos do cliente" }, { status: 500 });
  }
}

// POST - Criar pedido para um cliente
export async function POST(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 });
    }

    const body = await req.json();

    const client = await prisma.user.findUnique({ where: { id } });
    if (!client) {
      return NextResponse.json({ error: "Cliente não encontrado" }, { status: 404 });
    }

    const newOrder = await prisma.order.create({
      data: {
        userId: id,
        total: body.total ?? 0,
        items: { create: body.items ?? [] },
      },
      include: { user: true, items: true },
    });

    return NextResponse.json(newOrder, { status: 201 });
  } catch (error) {
    console.error("POST /api/order/client/[id] error:", error);
    return NextResponse.json({ error: "Erro ao criar pedido" }, { status: 500 });
  }
}

// PUT - Atualizar pedidos do cliente
export async function PUT(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 });
    }

    const body = await req.json();

    // Exemplo: atualizar todos os pedidos do cliente (apenas total aqui)
    const updated = await prisma.order.updateMany({
      where: { userId: id },
      data: { total: body.total ?? undefined },
    });

    return NextResponse.json({ message: `${updated.count} pedidos atualizados com sucesso` }, { status: 200 });
  } catch (error) {
    console.error("PUT /api/order/client/[id] error:", error);
    return NextResponse.json({ error: "Erro ao atualizar pedidos" }, { status: 500 });
  }
}

// DELETE - Deletar pedidos do cliente
export async function DELETE(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 });
    }

    const deleted = await prisma.order.deleteMany({ where: { userId: id } });

    return NextResponse.json({ message: `${deleted.count} pedidos deletados com sucesso` }, { status: 200 });
  } catch (error) {
    console.error("DELETE /api/order/client/[id] error:", error);
    return NextResponse.json({ error: "Erro ao deletar pedidos" }, { status: 500 });
  }
}