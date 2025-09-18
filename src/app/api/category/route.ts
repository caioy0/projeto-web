// @/app/api/category/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import slugify from "slugify";

// Helper 
function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : "Something went wrong";
}

// Create category
export async function POST(request: Request) {
  try {
    const body = await request.json(); // Recebe JSON do cliente
    const { name } = body;

    if (!name || typeof name !== "string") {
      return NextResponse.json({ error: "Category name is required" }, { status: 400 });
    }

    const category = await prisma.category.create({
      data: {
        name,
        slug: slugify(name, { lower: true }),
      },
    });

    return NextResponse.json({ message: "Category created successfully", category }, { status: 201 });
  } catch (error: unknown) {
    if (error instanceof Error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        } else {
            return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
        }
    }
}

// ===== GET =====
export async function GET() {
  try {
    const categories = await prisma.category.findMany();
    return NextResponse.json({ categories }, { status: 200 });
  } catch (error: unknown) {
    console.error(error);
    return NextResponse.json({ error: getErrorMessage(error) }, { status: 500 });
  }
}