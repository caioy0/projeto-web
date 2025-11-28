// @/components/Orders/CartClient.tsx
"use client";

import { useState, useEffect } from "react";
import { createOrder } from "@/actions/createOrder";
import { updateCart } from "@/actions/cart";
import { useRouter } from "next/navigation";

// Ícones SVG simples para não depender de bibliotecas externas (como lucide-react)
const TrashIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
);
const MinusIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/></svg>
);
const PlusIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
);

type CartItem = {
  productId: string;
  name: string;
  price: number;
  quantity: number;
};

interface CartClientProps {
  items: CartItem[];
  userId: string;
}

export default function CartClient({ items, userId }: CartClientProps) {
    const [userId2, setUserId] = useState<string | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [cartItems, setCartItems] = useState(items);
    const [loading, setLoading] = useState(false);
    const router = useRouter();
  
    // Busca userId e token logo ao montar
    useEffect(() => {
      (async () => {
        try {
          // 1. Verifica se está autenticado
          const authRes = await fetch("/api/auth/status", { cache: "no-store" });
          const authData = await authRes.json();
  
          if (!authData.isAuthenticated) {
            router.push("/login");
            return;
          }
  
          // 2. Busca o userId
          const meRes = await fetch("/api/auth/me", { cache: "no-store" });
          const meData = await meRes.json();
          if (!meData.userId) throw new Error("Não foi possível obter o usuário.");
          setUserId(meData.userId);
  
          // 3. Recupera o token do localStorage (se você salvar lá)
          const storedToken = localStorage.getItem("token");
          setToken(storedToken ?? null);
        } catch (error) {
          console.error(error);
          router.push("/");
        }
      })();
    }, [router]);
  
  

  // Calcular total
  const totalAmount = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  const updateQty = async (productId: string, qty: number) => {
    if (qty < 1) return;
    
    // Atualiza estado local instantaneamente para UX fluida
    const newItems = cartItems.map((item) =>
      item.productId === productId ? { ...item, quantity: qty } : item
    );
    setCartItems(newItems);
    
    // Atualiza backend em background (debounce seria ideal aqui em produção)
    await updateCart(userId, newItems, token);
  };

  const removeItem = async (productId: string) => {
    const newItems = cartItems.filter((i) => i.productId !== productId);
    setCartItems(newItems);
    await updateCart(userId, newItems, token);
  };

  const finishOrder = async () => {
    setLoading(true);
    const res = await createOrder(userId);
    if (res.success) {
      router.push(`/order/success?id=${res.order.id}`);
    } else {
      setLoading(false);
      // Aqui você poderia adicionar um toast de erro
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-zinc-400">
        <div className="bg-zinc-900/50 p-6 rounded-full mb-4 border border-zinc-800">
          <TrashIcon /> 
        </div>
        <p className="text-lg font-medium">Seu carrinho está vazio</p>
        <button 
          onClick={() => router.push('/')}
          className="mt-4 text-sm text-purple-400 hover:text-purple-300 transition-colors"
        >
          Voltar a comprar
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 text-zinc-100">
      <h1 className="text-3xl font-bold mb-8 bg-linear-to-r from-purple-400 to-blue-600 bg-clip-text text-transparent">
        Seu Carrinho
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Lista de Itens */}
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map((item) => (
            <div 
              key={item.productId} 
              className="group flex flex-col sm:flex-row items-start sm:items-center justify-between p-5 rounded-2xl bg-zinc-900/40 border border-white/5 hover:border-purple-500/20 transition-all duration-300 backdrop-blur-sm"
            >
              <div className="flex-1">
                <h3 className="font-semibold text-lg text-white mb-1">{item.name}</h3>
                <p className="text-zinc-400 text-sm">Unitário: R$ {item.price}</p>
                <p className="text-purple-400 font-medium sm:hidden mt-2">
                   Total: R$ {(item.price * item.quantity).toFixed(2)}
                </p>
              </div>

              <div className="flex items-center justify-between w-full sm:w-auto mt-4 sm:mt-0 gap-6">
                {/* Controlador de Quantidade Customizado */}
                <div className="flex items-center bg-black/40 rounded-lg border border-zinc-800">
                  <button
                    onClick={() => updateQty(item.productId, item.quantity - 1)}
                    className="p-2 text-zinc-400 hover:text-white hover:bg-white/5 rounded-l-lg transition-colors disabled:opacity-50"
                    disabled={item.quantity <= 1}
                  >
                    <MinusIcon />
                  </button>
                  <span className="w-10 text-center text-sm font-medium">{item.quantity}</span>
                  <button
                    onClick={() => updateQty(item.productId, item.quantity + 1)}
                    className="p-2 text-zinc-400 hover:text-white hover:bg-white/5 rounded-r-lg transition-colors"
                  >
                    <PlusIcon />
                  </button>
                </div>

                <div className="flex items-center gap-4">
                  <p className="hidden sm:block font-medium text-zinc-200 w-24 text-right">
                    R$ {(item.price * item.quantity).toFixed(2)}
                  </p>
                  
                  <button
                    className="p-2 text-zinc-500 hover:text-red-400 hover:bg-red-400/10 rounded-full transition-all"
                    onClick={() => removeItem(item.productId)}
                    title="Remover item"
                  >
                    <TrashIcon />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Resumo do Pedido (Sticky) */}
        <div className="lg:col-span-1">
          <div className="sticky top-4 rounded-2xl bg-zinc-900/80 border border-white/10 p-6 backdrop-blur-md shadow-xl shadow-black/20">
            <h2 className="text-xl font-bold mb-6 text-white">Resumo</h2>
            
            <div className="space-y-3 text-sm text-zinc-400 border-b border-white/5 pb-6 mb-6">
              <div className="flex justify-between">
                <span>Subtotal ({cartItems.length} itens)</span>
                <span>R$ {totalAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Frete</span>
                <span className="text-green-400">Grátis</span>
              </div>
            </div>

            <div className="flex justify-between items-end mb-8">
              <span className="text-zinc-300 font-medium">Total</span>
              <div className="text-right">
                <span className="text-3xl font-bold text-white block">
                  R$ {totalAmount.toFixed(2)}
                </span>
                <span className="text-xs text-zinc-500">em até 10x sem juros</span>
              </div>
            </div>

            <button
              disabled={loading}
              className="w-full relative group overflow-hidden bg-linear-to-r from-purple-600 to-blue-600 text-white font-bold py-4 px-6 rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-purple-900/20"
              onClick={finishOrder}
            >
              <span className="relative z-10">
                {loading ? "Processando..." : "Finalizar Compra"}
              </span>
              {/* Efeito de brilho no hover */}
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full bg-linear-to-r from-transparent via-white/20 to-transparent transition-transform duration-1000" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}