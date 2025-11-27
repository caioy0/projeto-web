// @/components/Orders/Orders.tsx
'use client';

import React, { useEffect, useState, useTransition } from 'react';
import {
  listAllOrders,
  listOrdersByUser,
  getOrderById,
  createOrder,
  deleteOrder,
  updateOrder,
  Order,
} from '@/actions/orders';

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [userId, setUserId] = useState('');
  const [orderId, setOrderId] = useState('');
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  /** GET ListarTodos */
  const fetchAllOrders = async () => {
    try {
      const data = await listAllOrders();
      setOrders(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar pedidos');
    }
  };

  /** GET ListarPorCliente */
  const fetchOrdersByUser = async () => {
    if (!userId) return;
    try {
      const data = await listOrdersByUser(userId);
      setOrders(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar pedidos do cliente');
    }
  };

  /** GET por código */
  const fetchOrderById = async () => {
    if (!orderId) return;
    try {
      const order = await getOrderById(orderId);
      setSelectedOrder(order);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao buscar pedido');
    }
  };

  /** POST criar pedido */
  const handleCreateOrder = async () => {
    startTransition(async () => {
      try {
        const newOrder = await createOrder({
          userId: 'USER_ID_AQUI', // substitua pelo id real
          items: [
            { productId: 'PRODUTO_ID_AQUI', quantity: 1 },
            { productId: 'OUTRO_PRODUTO_ID', quantity: 2 },
          ],
        });
        setOrders(prev => [newOrder, ...prev]);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao criar pedido');
      }
    });
  };

  /** DELETE */
  const handleDelete = (orderId: string) => {
    startTransition(async () => {
      try {
        await deleteOrder(orderId);
        setOrders(prev => prev.filter(o => o.id !== orderId));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao deletar pedido');
      }
    });
  };

  /** PUT */
  const handleStatusChange = (orderId: string, newStatus: string) => {
    startTransition(async () => {
      try {
        const updated = await updateOrder(orderId, { status: newStatus });
        setOrders(prev => prev.map(o => (o.id === orderId ? updated : o)));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao atualizar status');
      }
    });
  };

  useEffect(() => {
    fetchAllOrders();
  }, []);

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 space-y-6">
      <h1 className="text-2xl font-bold">Orders</h1>
      {error && <div className="text-red-600">{error}</div>}

      {/* Criar pedido */}
      <button
        onClick={handleCreateOrder}
        disabled={isPending}
        className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
      >
        Criar Pedido
      </button>

      {/* Buscar por cliente */}
      <div className="flex space-x-2 mt-4">
        <input
          type="text"
          placeholder="User ID"
          value={userId}
          onChange={e => setUserId(e.target.value)}
          className="border px-2 py-1 rounded"
        />
        <button
          onClick={fetchOrdersByUser}
          className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Buscar por Cliente
        </button>
      </div>

      {/* Buscar por código */}
      <div className="flex space-x-2 mt-4">
        <input
          type="text"
          placeholder="Order ID"
          value={orderId}
          onChange={e => setOrderId(e.target.value)}
          className="border px-2 py-1 rounded"
        />
        <button
          onClick={fetchOrderById}
          className="px-3 py-1 bg-purple-600 text-white rounded hover:bg-purple-700"
        >
          Buscar Pedido
        </button>
      </div>

      {selectedOrder && (
        <div className="border p-4 rounded shadow mt-4">
          <h2 className="font-bold">Pedido encontrado</h2>
          <p>ID: {selectedOrder.id}</p>
          <p>Status: {selectedOrder.status}</p>
          <p>Total: ${selectedOrder.total.toFixed(2)}</p>
          <p>Cliente: {selectedOrder.user.name} ({selectedOrder.user.email})</p>
        </div>
      )}

      {/* Lista de pedidos */}
      {orders.length === 0 && <p>Nenhum pedido encontrado.</p>}
      <ul className="space-y-4">
        {orders.map(order => (
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
                {order.items.map(item => (
                  <li key={item.id}>
                    Produto: {item.productId} — Qtd: {item.quantity} — Preço: ${item.price.toFixed(2)}
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
                onChange={e => handleStatusChange(order.id, e.target.value)}
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
