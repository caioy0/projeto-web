// src/app/product.ts
'use server';

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import slugify from "slugify";

// @/app/create-category => Create a category for products
export async function createCategory(formData: FormData): Promise<void> {
  const name = formData.get("name") as string;
  if (!name) throw new Error("Category name is required");

  await prisma.category.create({
    data: {
      name,
      slug: slugify(name),
    },
  });

  // Optionally redirect after creation
  redirect("/product"); 
}

// Create products in @app/register-product
export async function createProduct(formData: FormData) {
  try {
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const price = parseFloat(formData.get("price") as string);
    const sale = formData.get("sale") === "on"; // checkbox
    const salePrice = sale
      ? formData.get("salePrice")
        ? parseFloat(formData.get("salePrice") as string)
        : null
      : null;
    const quantity = parseInt(formData.get("quantity") as string);
    const categoryId = formData.get("categoryId") as string;

    await prisma.product.create({
      data: {
        name,
        description,
        // slug,
        price,
        sale,
        salePrice,
        quantity,
        categoryId,
      },
    });

    // Redirect to homepage after successful creation
    // redirect("/");
  } catch (error) {
    console.error("Error creating product:", error);
    throw new Error("Failed to create product");
  }
}

export interface CreateCategoryData {
  name: string;
}

// PUT product
export async function updateProduct(id: string, formData: FormData) {
  const name = formData.get("name")?.toString() || "";
  const description = formData.get("description")?.toString() || "";
  const price = parseFloat(formData.get("price")?.toString() || "0");
  const quantity = parseInt(formData.get("quantity")?.toString() || "0", 10);
  const sale = formData.get("sale") === "on";
  const salePriceRaw = formData.get("salePrice")?.toString();
  const salePrice = salePriceRaw ? parseFloat(salePriceRaw) : null;

  const existingProduct = await prisma.product.findUnique({ where: { id } });
  if (!existingProduct) {
    throw new Error(`Produto com ID ${id} não encontrado.`);
  }

  await prisma.product.update({
    where: { id },
    data: { name, description, price, quantity, sale, salePrice },
  });

  revalidatePath("/product/");
}

// DELETE
export async function deleteProduct(id: string) {
  await prisma.product.delete({ where: { id } });

  revalidatePath("/product/");
}