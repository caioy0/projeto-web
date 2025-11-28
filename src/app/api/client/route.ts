// @/app/api/client/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET - Listar todos os clientes
export async function GET() {
  try {
    const clients = await prisma.user.findMany({
      orderBy: { createdAt: "desc" }, // opcional: ordena do mais recente
    });

    return NextResponse.json(clients, { status: 200 });
  } catch (error) {
    console.error("GET /api/client error:", error);
    return NextResponse.json({ error: "Error fetching clients" }, { status: 500 });
  }
}