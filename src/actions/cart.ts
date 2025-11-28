// @app/actions/cart.ts
"use server";
import prisma from "@/lib/prisma";
import jwt from "jsonwebtoken";

type CartItem = {
  productId: string;
  quantity: number;
};

const JWT_SECRET = process.env.JWT_SECRET!;

export async function updateCart(userId: string | null, items: CartItem[], token: string | null) {
  if (!token) throw new Error("Token não fornecido");

  // Decodifica o JWT para garantir que o userId é válido
  const payload = jwt.verify(token, JWT_SECRET) as { userId: string };

  const id = payload.userId;
  if (!id) throw new Error("Token inválido: userId ausente");

  // Agora sim usa o userId correto no Prisma
  return prisma.cart.upsert({
    where: { userId: id },
    create: { userId: id, items },
    update: { items },
  });
}
