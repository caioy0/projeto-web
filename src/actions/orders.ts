// @/actions/orders.ts
'use server';

import prisma from '@/lib/prisma';
import nodemailer from 'nodemailer';

type OrderItemInput = {
  productId: string;
  quantity: number;
};

type CreateOrderInput = {
  userId: string;
  items: OrderItemInput[];
};

// Configuração do SMTP
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Função para enviar email de confirmação
async function sendOrderEmail(to: string, name: string, orderId: string) {
  const orderLink = `${process.env.NEXT_PUBLIC_APP_URL}/order/${orderId}`;
  const html = `
    <div style="font-family:Arial,sans-serif;line-height:1.6;color:#111827">
      <h1>Olá, ${name}! 👋</h1>
      <p>Seu pedido foi confirmado. Confira os detalhes clicando abaixo:</p>
      <a href="${orderLink}" style="display:inline-block;padding:12px 20px;background-color:#0f62fe;color:#fff;border-radius:6px;text-decoration:none;font-weight:bold;margin-top:12px;">
        Ver meu pedido
      </a>
      <p style="font-size: 14px; margin-top: 20px; color: #6b7280;">
        Se o botão acima não funcionar, copie e cole este link no navegador:
      </p>
      <p style="font-size: 13px; color: #0f62fe; word-break: break-word;">
        ${orderLink}
      </p>    
    </div>
  `;
  await transporter.sendMail({
    from: `"Minha Loja" <${process.env.SMTP_USER}>`,
    to,
    subject: 'Confirmação do seu pedido',
    html,
  });
}

// CREATE
export async function createOrder({ userId, items }: CreateOrderInput) {
  if (!userId || !items || items.length === 0) {
    throw new Error('Dados inválidos para criar pedido.');
  }

  const products = await prisma.product.findMany({
    where: { id: { in: items.map(i => i.productId) } },
  });

  if (products.length !== items.length) {
    throw new Error('Alguns produtos não foram encontrados.');
  }

  let total = 0;
  const orderItems = items.map((i) => {
    const product = products.find((p) => p.id === i.productId)!;
    const price = product.sale && product.salePrice ? product.salePrice : product.price;
    total += Number(price) * i.quantity;
    return { productId: i.productId, quantity: i.quantity, price };
  });

  const order = await prisma.order.create({
    data: { userId, total, items: { create: orderItems } },
    include: { items: true, user: true },
  });

  await sendOrderEmail(order.user.email, order.user.name, order.id);

  return order;
}

// GET all orders
export async function listAllOrders() {
  return prisma.order.findMany({
    include: { items: true, user: true },
    orderBy: { createdAt: 'desc' },
  });
}

// GET orders by user
export async function listOrdersByUser(userId: string) {
  return prisma.order.findMany({
    where: { userId },
    include: { items: true },
    orderBy: { createdAt: 'desc' },
  });
}

// GET order by ID
export async function getOrderById(orderId: string) {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { items: true, user: true },
  });
  if (!order) throw new Error('Pedido não encontrado.');
  return order;
}

// UPDATE order
export async function updateOrder(orderId: string, data: { status?: string; total?: number }) {
  return prisma.order.update({
    where: { id: orderId },
    data,
  });
}

// DELETE order
export async function deleteOrder(orderId: string) {
  return prisma.order.delete({
    where: { id: orderId },
  });
}
