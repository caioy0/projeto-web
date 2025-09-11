// src/app/api/products/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const { PrismaClient } = await import('@prisma/client');
  const prisma = new PrismaClient();

  try {
    const body = await request.json();
    const { name, description, price, salePrice, quantity, categoryId, sale } = body;

    if (!name || !description || !price || !quantity || !categoryId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const product = await prisma.product.create({
      data: {
        name,
        description,
        price: parseFloat(price),
        sale: Boolean(sale),
        salePrice: salePrice ? parseFloat(salePrice) : null,
        quantity: parseInt(quantity),
        categoryId,
      },
    });

    await prisma.$disconnect();
    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error('Product creation error:', error);
    await prisma.$disconnect();
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET() {
  const { PrismaClient } = await import('@prisma/client');
  const prisma = new PrismaClient();

  try {
    const products = await prisma.product.findMany({
      include: { category: true },
      orderBy: { createdAt: 'desc' },
    });

    await prisma.$disconnect();
    return NextResponse.json(products);
  } catch (error) {
    console.error('Products fetch error:', error);
    await prisma.$disconnect();
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
