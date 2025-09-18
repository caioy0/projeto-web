// @/app/product/[id]/route.ts

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET /api/product/:id : Search prod by ID (string)
export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(product, { status: 200 });
  } catch (error) {
    console.error("GET /api/product/[id] error:", error);
    return NextResponse.json({ error: "Error searching product" }, { status: 500 });
  }
}

// PUT /api/products/:id → atualiza produto
export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const body = await req.json();

    const updatedProduct = await prisma.product.update({
      where: { id },
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

    return NextResponse.json(updatedProduct, { status: 200 });
  } catch (error) {
    console.error("PUT /api/products/[id] error:", error);
    return NextResponse.json({ error: "Error updating the product" }, { status: 500 });
  }
}

// DELETE /api/products/:id → exclui produto
export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    await prisma.product.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Success! product deleated" }, { status: 200 });
  } catch (error) {
    console.error("DELETE /api/products/[id] error:", error);
    return NextResponse.json({ error: "Error del product" }, { status: 500 });
  }
}