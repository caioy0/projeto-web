// src/app/api/order/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import nodemailer from "nodemailer";

type OrderItemInput = {
  productId: string;
  quantity: number;
};

// Função para enviar email via SMTP
async function sendOrderEmail(to: string, name: string, orderId: string) {
  const orderLink = `${process.env.NEXT_PUBLIC_APP_URL}/order/${orderId}`;

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const html = `
    <div style="font-family:Arial,sans-serif;line-height:1.6;color:#111827">
      <h1>Olá, ${name}! 👋</h1>
      <p>Seu pedido foi atualizado. Confira os detalhes clicando abaixo:</p>
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
    from: `"Minha Empresa" <${process.env.SMTP_USER}>`,
    to,
    subject: "Atualização do seu pedido",
    html,
  });
}
// GET - Buscar pedidos do cliente por ID
export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    const orders = await prisma.order.findMany({
      where: { id }, // usar id da pasta
      include: {
        user: true,
        items: {
          include: { product: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    if (!orders || orders.length === 0) {
      return NextResponse.json(
        { error: "Nenhum pedido encontrado para este cliente" },
        { status: 404 }
      );
    }

    return NextResponse.json(orders, { status: 200 });
  } catch (error) {
    console.error("GET /api/order/client/[id] error:", error);
    return NextResponse.json(
      { error: "Erro ao buscar pedidos do cliente" },
      { status: 500 }
    );
  }
}

// PUT - atualizar pedido
export async function PUT(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const body: { items: OrderItemInput[] } = await req.json();
    const { items } = body;

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "Itens do pedido são obrigatórios" }, { status: 400 });
    }

    // Buscar produtos e recalcular total
    const products = await prisma.product.findMany({
      where: { id: { in: items.map((i) => i.productId) } },
    });

    let total = 0;
    const orderItemsData = items.map((i) => {
      const product = products.find((p) => p.id === i.productId);
      if (!product) throw new Error(`Produto ${i.productId} não encontrado`);
      const price = product.sale && product.salePrice ? product.salePrice : product.price;
      total += Number(price) * i.quantity;
      return { productId: i.productId, quantity: i.quantity, price };
    });

    // Atualizar pedido
    const order = await prisma.order.update({
      where: { id },
      data: {
        total,
        items: {
          deleteMany: {}, // remove itens antigos
          create: orderItemsData, // cria novos
        },
      },
      include: { items: true, user: true },
    });

    // Enviar email de atualização
    await sendOrderEmail(order.user.email, order.user.name, order.id);

    return NextResponse.json(order, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro desconhecido";
    console.error("Erro PUT /order/[id]:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// DELETE - remover pedido
export async function DELETE(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;

    const order = await prisma.order.delete({
      where: { id },
      include: { user: true },
    });

    // Opcional: enviar email notificando cancelamento
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: process.env.SMTP_SECURE === "true",
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    });

    const html = `<p>Olá, ${order.user.name},</p><p>Seu pedido #${order.id} foi cancelado.</p>`;
    await transporter.sendMail({
      from: `"Minha Empresa" <${process.env.SMTP_USER}>`,
      to: order.user.email,
      subject: "Pedido cancelado",
      html,
    });

    return NextResponse.json({ message: "Pedido removido com sucesso" }, { status: 200 });
  } catch (error) {
    console.error("Erro DELETE /order/[id]:", error);
    return NextResponse.json({ error: "Erro ao deletar pedido" }, { status: 500 });
  }
}