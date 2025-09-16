// @/app/products/api/route.ts

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET /product/api/ : list products
export async function GET() {
  try {
    const products = await prisma.product.findMany({
      include: {
        category: true,
      },
    });

    return NextResponse.json(products, { status: 200 });
  } catch (error) {
    console.error("GET /api/products error:", error);
    return NextResponse.json({ error: "Erro ao buscar produtos" }, { status: 500 });
  }
}

// POST /product/api/ : Create a product
export async function POST(req: Request) {
  try {
    const body = await req.json();

    const newProduct = await prisma.product.create({
      data: {
        name: body.name,
        description: body.description,
        price: parseFloat(body.price),
        quantity: parseInt(body.quantity, 10),
        sale: body.sale ?? false,
        salePrice: body.salePrice ? parseFloat(body.salePrice) : null,
        categoryId: body.categoryId,
      },
    });

    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    console.error("POST /api/products error:", error);
    return NextResponse.json({ error: "Erro ao criar produto" }, { status: 500 });
  }
}