// @/components/Orders/CartClient.tsx
"use client";

import { useState } from "react";
import { createOrder } from "@/actions/createOrder";
import { updateCart } from "@/actions/cart";
import { useRouter } from "next/navigation";

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
  const [cartItems, setCartItems] = useState(items);
  const router = useRouter();

  // mudar quantidade
  const updateQty = async (productId: string, qty: number) => {
    const newItems = cartItems.map((item) =>
      item.productId === productId ? { ...item, quantity: qty } : item
    );
    setCartItems(newItems);
    await updateCart(userId, newItems);
  };

  // remover
  const removeItem = async (productId: string) => {
    const newItems = cartItems.filter((i) => i.productId !== productId);
    setCartItems(newItems);
    await updateCart(userId, newItems);
  };

  // finalizar
  const finishOrder = async () => {
    const res = await createOrder(userId);
    if (res.success) {
      router.push(`/order/success?id=${res.order.id}`);
    }
  };

  if (cartItems.length === 0)
    return <p>Seu carrinho está vazio 😢</p>;

  return (
    <div className="space-y-4">
      {cartItems.map((item) => (
        <div key={item.productId} className="flex justify-between p-3 border rounded">
          <div>
            <p><strong>Produto:</strong> {item.name}</p>
            <p><strong>Preço:</strong> R$ {item.price.toFixed(2)}</p>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="number"
              className="w-16 border p-1"
              value={item.quantity}
              min={1}
              onChange={(e) =>
                updateQty(item.productId, Number(e.target.value))
              }
            />
            <button
              className="text-red-600"
              onClick={() => removeItem(item.productId)}
            >
              remover
            </button>
          </div>
        </div>
      ))}

      <button
        className="bg-blue-600 text-white px-4 py-2 rounded"
        onClick={finishOrder}
      >
        Finalizar Pedido
      </button>
    </div>
  );
}
