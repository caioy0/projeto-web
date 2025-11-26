// @/app/cart/page.tsx
import CartClient from "@/components/Orders/CartClient";
import prisma from "@/lib/prisma";
import { getServerUser } from "@/lib/getServerUser";

type CartItem = {
  productId: string;
  name: string;
  price: number;
  quantity: number;
};

export default async function CartPage() {
  const user = await getServerUser();

  if (!user) {
    return <div className="p-6">Você precisa estar logado.</div>;
  }

  const cart = await prisma.cart.findUnique({
    where: { userId: user.id },
  });

  const items: CartItem[] = Array.isArray(cart?.items)
    ? (cart?.items as CartItem[])
    : typeof cart?.items === "string"
      ? JSON.parse(cart.items as string)
      : [];

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Seu Carrinho</h1>
      <CartClient items={items} userId={user.id} />
    </div>
  );
}
