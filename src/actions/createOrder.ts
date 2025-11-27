// app/actions/createOrder.ts
"use server";
import prisma from "@/lib/prisma";
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;

type CartItem = {
  productId: string;
  quantity: number;
};

export async function createOrder(token: string) {
  if (!token) throw new Error("Token não fornecido");

  // 1. Decodificar token e extrair userId
  let payload: { userId: string };
  try {
    payload = jwt.verify(token, JWT_SECRET) as { userId: string };
  } catch {
    throw new Error("Token inválido ou expirado");
  }
  const userId = payload.userId;

  // 2. Buscar carrinho
  const cart = await prisma.cart.findUnique({ where: { userId } });
  if (!cart || !Array.isArray(cart.items) || cart.items.length === 0) {
    throw new Error("Carrinho vazio");
  }

  // 3. Buscar produtos
  const cartItems: CartItem[] = cart.items as CartItem[];
  const productIds = cartItems.map((i) => i.productId);
  const products = await prisma.product.findMany({ where: { id: { in: productIds } } });

  // 4. Montar itens + calcular total
  let total = 0;
  const orderItemsData = cartItems.map((item) => {
    const product = products.find((p) => p.id === item.productId);
    if (!product) throw new Error("Produto não encontrado: " + item.productId);

    const price = product.sale ? product.salePrice! : product.price;
    total += price * item.quantity;

    return { productId: product.id, quantity: item.quantity, price };
  });

  // 5. Criar pedido
  const order = await prisma.order.create({
    data: {
      userId,
      total,
      status: "pending",
      items: { create: orderItemsData },
    },
    include: { items: true },
  });

  // 6. Buscar usuário
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new Error("Usuário não encontrado");

  // 7. Limpar carrinho
  await prisma.cart.delete({ where: { userId } });

  // 8. Enviar e-mail
  const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: 587,
    auth: { user: process.env.MAIL_USER, pass: process.env.MAIL_PASS },
  });

  await transporter.sendMail({
    from: "CloudGames <no-reply@cloudgames.com>",
    to: user.email,
    subject: "Seu pedido foi realizado com sucesso! 🎉",
    html: `<h1>Olá, ${user.name}!</h1>
           <p>Seu pedido foi recebido e já está sendo processado.</p>
           <p><strong>ID do pedido:</strong> ${order.id}</p>
           <p><strong>Total:</strong> R$ ${total.toFixed(2)}</p>`,
  });

  return { success: true, order };
}
