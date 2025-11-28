// @/app/cart/page.tsx
import CartClient from "@/components/Orders/CartClient";
import prisma from "@/lib/prisma";
import { getServerUser } from "@/lib/getServerUser";
import TextPressure from "@/components/TextPressure";
import Link from "next/link";
import Header from "@/components/Header";

type CartItem = {
  productId: string;
  name: string;
  price: number;
  quantity: number;
};

export default async function CartPage() {
  const user = await getServerUser();

if (!user) {
    return (
      <div className="relative flex flex-col items-center justify-center min-h-[60vh] px-4 overflow-hidden">
        
        {/* Elemento de Fundo (Glow Roxo/Azul) para ambientação */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-purple-600/20 blur-[120px] rounded-full pointer-events-none" />

        <div className="relative z-10 max-w-3xl w-full text-center">
          
          {/* Efeito TextPressure */}
          {/* Aumentei a altura para o efeito não cortar */}
          <div className="relative h-[150px] mb-2"> 
            <TextPressure
              text="LOGIN NECESSÁRIO"
              flex={true}
              alpha={false}
              stroke={false}
              width={true}
              weight={true}
              italic={true}
              textColor="#ffffff"
              strokeColor="#ff0000"
              minFontSize={36}
            />
          </div>

          {/* Card com Glassmorphism (Vidro) para o conteúdo de texto */}
          <div className="inline-block p-8 rounded-2xl bg-zinc-900/40 border border-white/5 backdrop-blur-sm shadow-xl">
            <h2 className="text-xl text-zinc-200 font-semibold mb-3">
              Você precisa estar conectado
            </h2>
            <p className="text-zinc-400 mb-8 max-w-md mx-auto">
              Para acessar seu carrinho, gerenciar pedidos e finalizar compras, 
              é necessário entrar na sua conta.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link 
                href="/login"
                className="group relative px-8 py-3 rounded-xl bg-linear-to-r from-purple-600 to-blue-600 text-white font-bold transition-all hover:scale-105 hover:shadow-[0_0_20px_rgba(147,51,234,0.5)]"
              >
                Fazer Login
                <div className="absolute inset-0 rounded-xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>

              <Link 
                href="/register"
                className="px-8 py-3 rounded-xl border border-white/10 text-zinc-300 hover:bg-white/5 hover:text-white transition-colors"
              >
                Criar Conta
              </Link>
            </div>
          </div>

        </div>
      </div>
    );
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
    <main className="p-12">
      <div>
        <Header />
      </div>
      <div className="p-6 max-w-3xl mx-auto">
        <CartClient items={items} userId={user.id} />
      </div>
    </main>
  );
}
