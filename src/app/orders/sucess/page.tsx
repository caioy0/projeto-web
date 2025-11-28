// app/order/success/page.tsx
import prisma from "@/lib/prisma";

interface OrderSuccessPageProps {
  searchParams: { id: string };
}

export default async function OrderSuccessPage({ searchParams }: OrderSuccessPageProps) {
  const id = searchParams.id;

  const order = await prisma.order.findUnique({
    where: { id },
    include: { items: { include: { product: true } } }
  });

  if (!order) {
    return <div className="p-6">Pedido não encontrado.</div>;
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4 text-green-600">
        Pedido concluído com sucesso! 🎉
      </h1>

      <p>ID do Pedido: <strong>{order.id}</strong></p>
      <p>Status: <strong>{order.status}</strong></p>
      <p>Total: <strong>R$ {order.total.toFixed(2)}</strong></p>

      <h2 className="text-xl font-semibold mt-6">Itens:</h2>
      <div className="space-y-3 mt-2">
        {order.items.map((item) => (
          <div key={item.id} className="p-3 border rounded">
            <p>
              {item.quantity}x {item.product.name}
            </p>
            <p>Preço: R$ {item.price.toFixed(2)}</p>
          </div>
        ))}
      </div>

      <a
        href="/orders"
        className="mt-6 inline-block px-4 py-2 bg-blue-600 text-white rounded"
      >
        Ver minhas ordens
      </a>
    </div>
  );
}
