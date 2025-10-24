// @/components/Orders/Orders.tsx
'use client';

import React, { useEffect, useState, useTransition } from 'react';
import { listAllOrders, deleteOrder, updateOrder } from '@/actions/orders';

type OrderItem = {
  id: string;
  productId: string;
  quantity: number;
  price: number;
};

type Order = {
  id: string;
  user: { name: string; email: string };
  total: number;
  status: string;
  items: OrderItem[];
  createdAt: string;
};

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = async () => {
    try {
      const data = await listAllOrders();
      const formattedOrders = data.map(order => ({
        ...order,
        createdAt: order.createdAt.toISOString(), // ou .toLocaleString() se preferir
        items: order.items.map(item => ({ ...item })),
        user: { name: order.user.name, email: order.user.email },
        }));

        setOrders(formattedOrders);
        setOrders(formattedOrders);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'Erro ao carregar pedidos');
    }
  };
  

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleDelete = (orderId: string) => {
    startTransition(async () => {
      try {
        await deleteOrder(orderId);
        setOrders((prev) => prev.filter((o) => o.id !== orderId));
      } catch (err) {
        console.error(err);
        setError(err instanceof Error ? err.message : 'Erro ao deletar pedido');
      }
    });
  };

  const handleStatusChange = (orderId: string, newStatus: string) => {
    startTransition(async () => {
      try {
        await updateOrder(orderId, { status: newStatus });
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
        );
      } catch (err) {
        console.error(err);
        setError(err instanceof Error ? err.message : 'Erro ao atualizar status');
      }
    });
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 space-y-6">
      <h1 className="text-2xl font-bold">Orders</h1>

      {error && <div className="text-red-600">{error}</div>}

      {orders.length === 0 && <p>No orders found.</p>}

      <ul className="space-y-4">
        {orders.map((order) => (
          <li key={order.id} className="border p-4 rounded shadow">
            <div className="flex justify-between items-center mb-2">
              <span className="font-semibold">Order ID: {order.id}</span>
              <span>Status: {order.status}</span>
            </div>
            <p>User: {order.user.name} ({order.user.email})</p>
            <p>Total: ${order.total.toFixed(2)}</p>
            <div className="mt-2">
              <p className="font-semibold">Items:</p>
              <ul className="ml-4 list-disc">
                {order.items.map((item) => (
                  <li key={item.id}>
                    Product ID: {item.productId} — Quantity: {item.quantity} — Price: ${item.price.toFixed(2)}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-3 flex space-x-2">
              <button
                onClick={() => handleDelete(order.id)}
                disabled={isPending}
                className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
              >
                Delete
              </button>

              <select
                value={order.status}
                onChange={(e) => handleStatusChange(order.id, e.target.value)}
                className="border rounded px-2 py-1"
              >
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
              </select>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
