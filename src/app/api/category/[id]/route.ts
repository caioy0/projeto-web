// @/app/api/category/[id]/route.ts
import { NextResponse} from "next/server";
import prisma from "@/lib/prisma";


// GET por ID
export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    const category = await prisma.category.findUnique({
      where: { id },
    });

    if (!category) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 });
    }

    return NextResponse.json(category, { status: 200 });
  } catch (error) {
    console.error("GET /api/category/[id] error:", error);
    return NextResponse.json({ error: "Error searching category" }, { status: 500 });
  }
}

// PUT por ID
export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const body = await req.json();
    const { name } = body;

    if (!name || typeof name !== "string") {
      return NextResponse.json({ error: "Category name is required" }, { status: 400 });
    }

    const updatedCategory = await prisma.category.update({
      where: { id },
      data: { name },
    });

    return NextResponse.json({ message: "Category updated successfully", updatedCategory }, { status: 200 });
  } catch (error) {
    console.error("PUT /api/category/[id] error:", error);
    return NextResponse.json({ error: "Error updating category" }, { status: 500 });
  }
}

// DELETE por ID
export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    await prisma.category.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Category deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("DELETE /api/category/[id] error:", error);
    return NextResponse.json({ error: "Error deleting category" }, { status: 500 });
  }
}