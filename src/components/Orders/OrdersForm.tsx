// @/components/Orders/OrderForm.tsx
"use client";

import React, { useState, useEffect, useTransition } from "react";

type Product = {
  id: string;
  name: string;
  price: number;
};

type User = {
  id: string;
  name: string;
  email: string;
};

export default function OrderForm() {
  const [users, setUsers] = useState<User[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [items, setItems] = useState<{ productId: string; quantity: number }[]>(
    []
  );
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);

  // Busca usuários e produtos
  useEffect(() => {
    const fetchData = async () => {
      try {
        const usersRes = await fetch("/api/users"); // você precisa ter esse endpoint
        const prodsRes = await fetch("/api/products"); // idem para produtos
        setUsers(await usersRes.json());
        setProducts(await prodsRes.json());
      } catch (err) {
        console.error("Erro ao buscar dados:", err);
      }
    };
    fetchData();
  }, []);

  // Adiciona produto ao pedido
  const addItem = () => {
    setItems([...items, { productId: "", quantity: 1 }]);
  };

  // Atualiza item
  const updateItem = (index: number, field: string, value: string | number) => {
    const newItems = [...items];
    if (field === "productId") newItems[index].productId = value as string;
    if (field === "quantity")
      newItems[index].quantity = Number(value) > 0 ? Number(value) : 1;
    setItems(newItems);
  };

  // Remove item
  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  // Envia pedido
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      try {
        const res = await fetch("/api/order", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: selectedUser, items }),
        });

        if (!res.ok) throw new Error("Erro ao criar pedido");

        setMessage("✅ Pedido criado com sucesso!");
        setItems([]);
        setSelectedUser("");
      } catch (err) {
        console.error(err);
        setMessage("❌ Erro ao criar pedido.");
      }
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-2xl mx-auto bg-white shadow p-6 rounded space-y-4"
    >
      <h2 className="text-xl font-bold">Criar Pedido</h2>

      {message && <p className="text-center">{message}</p>}

      {/* Selecionar usuário */}
      <div>
        <label className="block mb-1 font-medium">Usuário</label>
        <select
          value={selectedUser}
          onChange={(e) => setSelectedUser(e.target.value)}
          required
          className="border px-3 py-2 rounded w-full"
        >
          <option value="">Selecione um usuário</option>
          {users.map((u) => (
            <option key={u.id} value={u.id}>
              {u.name} ({u.email})
            </option>
          ))}
        </select>
      </div>

      {/* Itens do pedido */}
      <div>
        <label className="block mb-1 font-medium">Itens</label>
        {items.map((item, index) => (
          <div key={index} className="flex space-x-2 mb-2">
            <select
              value={item.productId}
              onChange={(e) =>
                updateItem(index, "productId", e.target.value)
              }
              required
              className="border px-3 py-2 rounded w-full"
            >
              <option value="">Selecione um produto</option>
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} — R${p.price.toFixed(2)}
                </option>
              ))}
            </select>
            <input
              type="number"
              min={1}
              value={item.quantity}
              onChange={(e) =>
                updateItem(index, "quantity", e.target.value)
              }
              className="border px-3 py-2 rounded w-20"
            />
            <button
              type="button"
              onClick={() => removeItem(index)}
              className="px-3 py-1 bg-red-500 text-white rounded"
            >
              X
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={addItem}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          + Adicionar Item
        </button>
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
      >
        Criar Pedido
      </button>
    </form>
  );
}
