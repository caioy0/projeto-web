// src/app/api/products/busca/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const term = searchParams.get("term") ?? "";

    const products = await prisma.product.findMany({
      where: {
        OR: [
          { name: { contains: term} },
          { description: { contains: term} },
        ],
      },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        sale: true,
        salePrice: true,
        quantity: true,
        categoryId: true,
      },
    });

    return NextResponse.json(products);
  } catch (err) {
    console.error("GET /api/products/busca error:", err);
    return NextResponse.json({ error: "Error searching products" }, { status: 500 });
  }
}
