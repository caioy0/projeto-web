// src/app/api/products/vitrine/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      where: { sale: true }, // PRODUCTS IN SALE
      orderBy: { createdAt: "desc" }, // RECENT FIRST
      take: 10, // LIMIT 10 PRODUCTS
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
    console.error("GET /api/products/vitrine error:", err);
    return NextResponse.json({ error: "Error searching products in showcase" }, { status: 500 });
  }
}
