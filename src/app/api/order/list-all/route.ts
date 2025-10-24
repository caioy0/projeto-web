// src/app/api/order/list-all/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET - listar todos os pedidos
export async function GET() {
  try {
    // Buscar todos os pedidos
    const orders = await prisma.order.findMany({
      include: {
        user: true,      // traz dados do usuário
        items: true,     // traz os itens do pedido
      },
      orderBy: { createdAt: "desc" }, // do mais recente para o mais antigo
    });

    return NextResponse.json(orders, { status: 200 });
  } catch (error) {
    console.error("Erro ao listar todos os pedidos:", error);
    return NextResponse.json({ error: "Erro ao listar pedidos" }, { status: 500 });
  }
}
