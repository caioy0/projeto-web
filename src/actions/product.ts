// src/app/product.ts
'use server';

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { writeFile } from "fs/promises";
import path from "path";
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
  redirect("/"); 
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
    const image = formData.get("image") as string | null;

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
        image,
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

  let imagePath: string | null = null;

  const file = formData.get("image") as File | null;
  const imageUrl = formData.get("imageUrl") as string | null;

  if (file && file.size > 0) {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const fileName = `${Date.now()}-${file.name}`;
    const filePath = path.join(process.cwd(), "public/uploads", fileName);
    await writeFile(filePath, buffer);
    imagePath = `/uploads/${fileName}`;
  } else if (imageUrl && imageUrl.trim() !== "") {
    imagePath = imageUrl;
  }

  const existingProduct = await prisma.product.findUnique({ where: { id } });
  if (!existingProduct) {
    throw new Error(`Produto com ID ${id} não encontrado.`);
  }

  await prisma.product.update({
    where: { id },
    data: { name, description, price, quantity, sale, salePrice, image: imagePath },
  });

  revalidatePath("/product/");
}

// DELETE product
export async function deleteProduct(id: string) {
  try {
    await prisma.product.delete({
      where: { id },
    });

    // Atualiza a lista de produtos
    revalidatePath("/product");
  } catch (error) {
    console.error("Erro ao deletar produto:", error);
    throw new Error("Falha ao deletar o produto");
  }
}