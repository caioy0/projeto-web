// src/app/api/order/by-client/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { ObjectId } from "mongodb";

// GET - listar pedidos por cliente
export async function GET(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    // Aguardar a resolução da Promise dos params
    const { id } = await context.params;

    // Validar ObjectId do MongoDB
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "ID do cliente inválido" }, { status: 400 });
    }

    // Buscar pedidos do cliente
    const orders = await prisma.order.findMany({
      where: { userId: id },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        user: true,
      },
      orderBy: { createdAt: "desc" }, // mais recentes primeiro
    });

    if (!orders.length) {
      return NextResponse.json({ error: "Nenhum pedido encontrado para este cliente" }, { status: 404 });
    }

    return NextResponse.json(orders, { status: 200 });
  } catch (error) {
    console.error("Erro GET /order/by-client/[id]:", error);
    return NextResponse.json({ error: "Erro ao listar pedidos" }, { status: 500 });
  }
}