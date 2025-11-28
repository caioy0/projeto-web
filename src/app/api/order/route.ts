// src/app/api/order/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";

type OrderItemInput = {
  productId: string;
  quantity: number;
};

// Função para enviar email de confirmação via SMTP
async function sendOrderEmail(to: string, name: string, orderId: string) {
  const orderLink = `${process.env.NEXT_PUBLIC_APP_URL}/order/${orderId}`;

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: process.env.SMTP_SECURE === "true", // true se SSL
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const html = `
    <div style="font-family:Arial,sans-serif;line-height:1.6;color:#111827">
      <h1>Olá, ${name}! 👋</h1>
      <p>Seu pedido foi confirmado. Confira os detalhes clicando abaixo:</p>
      <a href="${orderLink}" style="display:inline-block;padding:12px 20px;background-color:#0f62fe;color:#fff;border-radius:6px;text-decoration:none;font-weight:bold;margin-top:12px;">
        Ver meu pedido
      </a>
      <p style="font-size: 14px; margin-top: 20px; color: #6b7280;">
        Se o botão acima não funcionar, copie e cole este link no seu navegador:
      </p>
      <p style="font-size: 13px; color: #0f62fe; word-break: break-word;">
        ${orderLink}
      </p>    
    </div>
  `;

  await transporter.sendMail({
    from: `"CloudGames" <${process.env.SMTP_USER}>`,
    to,
    subject: "Confirmação do seu pedido",
    html,
  });
}

// Extrai userId do token JWT
function getUserIdFromRequest(req: Request) {
  const authHeader = req.headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer ")) return null;

  const token = authHeader.split(" ")[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
    return payload.userId;
  } catch {
    return null;
  }
}

// POST - criar pedido
export async function POST(req: Request) {
  try {
    const userId = getUserIdFromRequest(req);
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body: { items: OrderItemInput[] } = await req.json();
    const { items } = body;

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "Itens do pedido são obrigatórios" }, { status: 400 });
    }

    // Transação Prisma
    const order = await prisma.$transaction(async (tx) => {
      const products = await tx.product.findMany({
        where: { id: { in: items.map((i) => i.productId) } },
      });

      let total = 0;
      const orderItemsData = items.map((i) => {
        const product = products.find((p) => p.id === i.productId);
        if (!product) throw new Error(`Produto ${i.productId} não encontrado`);
        if (product.quantity < i.quantity) throw new Error(`Estoque insuficiente para ${product.name}`);

        const price = product.sale && product.salePrice ? product.salePrice : product.price;
        total += Number(price) * i.quantity;

        return {
          productId: i.productId,
          quantity: i.quantity,
          price,
        };
      });

      // Atualiza estoque dos produtos
      for (const item of orderItemsData) {
        await tx.product.update({
          where: { id: item.productId },
          data: { quantity: { decrement: item.quantity } },
        });
      }

      // Cria pedido e itens
      const orderCreated = await tx.order.create({
        data: {
          userId,
          total,
          status: "pending",
          items: { create: orderItemsData },
        },
        include: { items: true, user: true },
      });

      return orderCreated;
    });

    // Envia email
    await sendOrderEmail(order.user.email, order.user.name, order.id);

    return NextResponse.json(order, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Erro desconhecido";
    console.error("Erro ao criar pedido:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
