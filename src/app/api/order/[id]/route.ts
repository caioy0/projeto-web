// src/app/api/order/[id]/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET
export async function GET(
  _req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    const order = await prisma.order.findUnique({
      where: { id },
      include: { items: true, user: true },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found!" }, { status: 404 });
    }

    return NextResponse.json(order, { status: 200 });
  } catch (error) {
    console.error("GET /api/order/[id] error:", error);
    return NextResponse.json({ error: "Error fetching order" }, { status: 500 });
  }
}

// PUT
export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const { status } = await req.json();

    if (!status || typeof status !== "string") {
      return NextResponse.json({ error: "Status is required" }, { status: 400 });
    }

    const order = await prisma.order.update({
      where: { id },
      data: { status },
    });

    return NextResponse.json(order, { status: 200 });
  } catch (error) {
    console.error("PUT /api/order/[id] error:", error);
    return NextResponse.json({ error: "Error updating order" }, { status: 500 });
  }
}

// DEL
export async function DELETE(
  _req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    await prisma.order.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Order deleted!" }, { status: 200 });
  } catch (error) {
    console.error("DELETE /api/order/[id] error:", error);
    return NextResponse.json({ error: "Error deleting order" }, { status: 500 });
  }
}
