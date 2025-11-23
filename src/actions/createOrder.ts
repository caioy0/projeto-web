// app/actions/createOrder.ts
"use server";

import prisma from "@/lib/prisma";
import nodemailer from "nodemailer";

export async function createOrder(userId: string) {
  // 1. Buscar carrinho
  const cart = await prisma.cart.findUnique({
    where: { userId },
  });

  if (!cart || !Array.isArray(cart.items) || cart.items.length === 0) {
    throw new Error("Carrinho vazio");
  }

  // 2. Buscar produtos do carrinho
type CartItem = {
    productId: string;
    quantity: number;
};

const cartItems: CartItem[] = cart.items as CartItem[];
const productIds = cartItems.map((i) => i.productId);

  const products = await prisma.product.findMany({
    where: { id: { in: productIds } },
  });

  // 3. Montar itens do pedido + calcular total
  let total = 0;

const orderItemsData = cartItems.map((item) => {
    const product = products.find((p) => p.id === item.productId);

    if (!product) {
        throw new Error("Produto não encontrado: " + item.productId);
    }

    const price: number = product.sale ? product.salePrice! : product.price;

    total += price * item.quantity;

    return {
        productId: product.id,
        quantity: item.quantity,
        price,
    };
});

  // 4. Criar pedido
  const order = await prisma.order.create({
    data: {
      userId,
      total,
      status: "pending",
      items: {
        create: orderItemsData,
      },
    },
    include: {
      items: true,
    },
  });

  // 5. Buscar usuário
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) throw new Error("Usuário não encontrado");

  // 6. Limpar carrinho
  await prisma.cart.delete({
    where: { userId },
  });

  // 7. Enviar e-mail de confirmação
  const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: 587,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: "CloudGames <no-reply@cloudgames.com>",
    to: user.email,
    subject: "Seu pedido foi realizado com sucesso! 🎉",
    html: `
      <div style="font-family:Arial,sans-serif;line-height:1.6;color:#111827;">
        <h1>Olá, ${user.name}!</h1>
        <p>Seu pedido foi recebido e já está sendo processado.</p>
        <p><strong>ID do pedido:</strong> ${order.id}</p>
        <p><strong>Total:</strong> R$ ${total.toFixed(2)}</p>
        <br />
        <h3>Itens do pedido:</h3>
        ${order.items
          .map(
            (i) =>
              `<p>${i.quantity}x • ${i.price.toFixed(2)} cada</p>`
          )
          .join("")}
        <br />
        <p>Obrigado por comprar na CloudGames! 🎮</p>
      </div>
    `,
  });

  return { success: true, order };
}
