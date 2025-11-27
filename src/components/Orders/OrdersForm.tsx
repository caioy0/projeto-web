// @/components/Orders/OrderForm.tsx
"use client";

import React, { useState, useEffect, useTransition } from "react";
import { User, Box, Trash2, PlusCircle, ShoppingCart, CheckCircle, AlertCircle } from "lucide-react";

type Product = { id: string; name: string; price: number };
type UserType = { id: string; name: string; email: string };

export default function OrderForm() {
  const [users, setUsers] = useState<UserType[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [items, setItems] = useState<{ productId: string; quantity: number }[]>([
    { productId: "", quantity: 1 },
  ]);

  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Fetch Users + Products
  useEffect(() => {
    (async () => {
      try {
        const [u, p] = await Promise.all([
          fetch("/api/client").then((r) => r.json()),
          fetch("/api/product").then((r) => r.json()),
        ]);
        setUsers(u);
        setProducts(p);
      } catch (err) {
        console.error("Erro ao buscar dados:", err);
      }
    })();
  }, []);

  const updateItem = (i: number, field: "productId" | "quantity", value: string | number) => {
    setItems((prev) =>
      prev.map((item, index) =>
        index !== i ? item : { ...item, [field]: field === "quantity" ? Number(value) : value }
      )
    );
  };

  const addItem = () => setItems([...items, { productId: "", quantity: 1 }]);
  const removeItem = (i: number) => setItems(items.filter((_, idx) => idx !== i));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedUser) return setMessage({ text: "⚠️ Selecione um usuário.", type: 'error' });
    if (!items.every((i) => i.productId)) return setMessage({ text: "⚠️ Todos os itens precisam de produto.", type: 'error' });

    startTransition(async () => {
      try {
        const res = await fetch("/api/order", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: selectedUser, items }),
        });

        if (!res.ok) throw new Error();

        setMessage({ text: "Pedido criado com sucesso!", type: 'success' });
        setItems([{ productId: "", quantity: 1 }]);
        setSelectedUser("");
        
        setTimeout(() => setMessage(null), 3000);
      } catch {
        setMessage({ text: "Erro ao criar pedido.", type: 'error' });
      }
    });
  };

  return (
    <div className="relative min-h-screen w-full flex justify-center pt-32 pb-12 px-4 sm:px-6 lg:px-8 bg-[#050505] text-gray-100">
      
      <div className="fixed top-20 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-purple-900/20 rounded-full blur-[120px] -z-10 pointer-events-none" />

      <div className="w-full max-w-3xl animate-in fade-in slide-in-from-bottom-4 duration-700">
        
        <div className="mb-8 text-center md:text-left">
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-linear-to-r from-purple-400 via-pink-400 to-white w-fit mx-auto md:mx-0">
            Novo Pedido
          </h1>
          <p className="text-gray-400 mt-2">
            Preencha os dados abaixo para registrar uma nova venda no sistema.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 md:p-8 shadow-2xl space-y-8"
        >
          {message && (
            <div className={`p-4 rounded-xl flex items-center gap-3 ${
              message.type === 'success' ? 'bg-green-500/10 border border-green-500/20 text-green-200' : 'bg-red-500/10 border border-red-500/20 text-red-200'
            }`}>
              {message.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
              <span className="font-medium">{message.text}</span>
            </div>
          )}

          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
              <User size={16} className="text-purple-400" /> Cliente
            </label>
            <div className="relative group">
              <select
                value={selectedUser}
                onChange={(e) => setSelectedUser(e.target.value)}
                className="w-full appearance-none px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all cursor-pointer"
                required
              >
                <option value="" disabled className="bg-[#050505] text-gray-500">Selecione um cliente...</option>
                {users.map((u) => (
                  <option key={u.id} value={u.id} className="bg-[#050505] text-gray-200">
                    {u.name} — {u.email}
                  </option>
                ))}
              </select>

              <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-gray-500 group-hover:text-purple-400 transition-colors">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" /></svg>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                <Box size={16} className="text-purple-400" /> Itens do Pedido
              </label>
              <span className="text-xs text-gray-500 uppercase tracking-wider font-bold">Qtd</span>
            </div>
            
            <div className="space-y-3">
              {items.map((item, index) => (
                <div key={index} className="flex flex-col sm:flex-row gap-3 items-start sm:items-center bg-white/5 p-3 rounded-xl border border-white/5 hover:border-white/10 transition-colors">
                  
                  <div className="relative w-full sm:flex-1 group">
                    <select
                      value={item.productId}
                      onChange={(e) => updateItem(index, "productId", e.target.value)}
                      className="w-full appearance-none px-4 py-2 bg-black/40 border border-white/10 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500/50 text-sm cursor-pointer"
                    >
                      <option value="" disabled className="bg-[#050505]">Selecione um produto...</option>
                      {products.map((p) => (
                        <option key={p.id} value={p.id} className="bg-[#050505]">
                          {p.name} — R$ {p.price.toFixed(2)}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    <input
                      type="number"
                      min={1}
                      value={item.quantity}
                      onChange={(e) => updateItem(index, "quantity", e.target.value)}
                      className="w-20 px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500/50 text-center"
                    />

                    <button
                      type="button"
                      onClick={() => removeItem(index)}
                      className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors ml-auto sm:ml-0"
                      title="Remover item"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={addItem}
              className="flex items-center gap-2 text-sm text-purple-400 hover:text-purple-300 font-medium transition-colors mt-2"
            >
              <PlusCircle size={16} /> Adicionar outro item
            </button>
          </div>

          <div className="pt-6 border-t border-white/10 flex justify-end">
            <button
              type="submit"
              disabled={isPending}
              className="flex items-center gap-2 px-8 py-3 bg-linear-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl hover:from-purple-500 hover:to-pink-500 hover:shadow-lg hover:shadow-purple-500/25 transition-all transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPending ? (
                <span className="flex items-center gap-2">Processando...</span>
              ) : (
                <>
                  <ShoppingCart size={18} /> Criar Pedido
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}