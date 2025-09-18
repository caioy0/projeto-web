// src/app/api/order/by-client/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET - listar pedidos por cliente
export async function GET(
  req: NextRequest,
  { params }: { params: Promise <{ id: string }> }
) {
  try {
    const { id } = await params;

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
      orderBy: { createdAt: "desc" },
    });

    if (!orders.length) {
      return NextResponse.json(
        { error: "Nenhum pedido encontrado para este cliente" },
        { status: 404 }
      );
    }

    return NextResponse.json(orders, { status: 200 });
  } catch (error) {
    console.error("Erro GET /order/by-client/[id]:", error);
    return NextResponse.json(
      { error: "Erro ao listar pedidos" },
      { status: 500 }
    );
  }
}
