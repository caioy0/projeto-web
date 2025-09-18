// src/app/api/order/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import nodemailer from "nodemailer";

type OrderItemInput = {
  productId: string;
  quantity: number;
};

// Função para enviar email quando o pedido for confirmado
async function sendOrderEmail(to: string, name: string, orderId: string) {
  const orderLink = `http://localhost:3000/order/${orderId}`;
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

  // Configuração do Nodemailer
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST, // Ex: smtp.gmail.com
    port: Number(process.env.SMTP_PORT) || 587,
    secure: false, // true se usar 465
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  // Envia o email
  await transporter.sendMail({
    from: `"CloudGames" <${process.env.SMTP_USER}>`,
    to,
    subject: "Confirmação do seu pedido",
    html,
  });
}

// POST
export async function POST(req: Request) {
  try {
    const body: { userId: string; items: OrderItemInput[] } = await req.json();
    const { userId, items } = body;

    if (!userId || !items || items.length === 0) {
      return NextResponse.json({ error: "Dados inválidos" }, { status: 400 });
    }

    // Buscar produtos e calcular total
    const products = await prisma.product.findMany({
      where: { id: { in: items.map((i) => i.productId) } },
    });

    let total = 0;
    const orderItems = items.map((i) => {
      const product = products.find((p) => p.id === i.productId);

      if (!product) throw new Error(`Produto: ${i.productId} não encontrado!`);

      const price =
        product.sale && product.salePrice ? product.salePrice : product.price;
      total += Number(price) * i.quantity;

      return {
        productId: i.productId,
        quantity: i.quantity,
        price,
      };
    });

    // Criar pedido
    const order = await prisma.order.create({
      data: {
        userId,
        total,
        items: {
          create: orderItems,
        },
      },
      include: { items: true, user: true },
    });

    // Enviar email de confirmação
    await sendOrderEmail(order.user.email, order.user.name, order.id);

    return NextResponse.json(order, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Erro desconhecido";
    console.error("Erro ao criar pedido:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
