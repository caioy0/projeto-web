// src/app/cadastroProduto/api/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const { name, description, price, sale, salePrice, quantity } = await request.json();

    // Check if user already exists
    const existingProduct = await prisma.user.findUnique({
      where: { name },
    });

    if (existingProduct) {
      return NextResponse.json(
        { message: 'Product already exists' },
        { status: 409 }
      );
    }

    const user = await prisma.user.create({
      data: {
        name,
        description,
        price,
        sale,
        salePrice,
        quantity
      },
    });

    // Remove password from response

    return NextResponse.json(
      { 
        message: 'Product created successfully',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}