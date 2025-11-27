// src/components/Cards.tsx
'use client'

import { useState, useRef, MouseEvent, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { updateCart } from "@/actions/cart"; 

// Ícones
// const HeartIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>;
const PlusIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>;
const GamepadIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="6" y1="12" x2="10" y2="12"></line><line x1="8" y1="10" x2="8" y2="14"></line><line x1="15" y1="13" x2="15.01" y2="13"></line><line x1="18" y1="11" x2="18.01" y2="11"></line><rect x="2" y="6" width="20" height="12" rx="2"></rect></svg>;
const TimerIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>;

type CardProps = {
  id: string
  name: string
  price: number // Preço original
  image: string
  category?: string
  description: string
  userId?: string
  sale?: boolean
  salePrice?: number
}

export function Card({ id, name, price, salePrice, image, category = "Jogo", description }: CardProps) {
  const [isOpen, setIsOpen] = useState(false)
  const divRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(false)

  // Lógica de Promoção
  const hasDiscount = salePrice && salePrice > 0 && salePrice < price;
  const currentPrice = hasDiscount ? salePrice : price;
  const discountPercentage = hasDiscount ? Math.round(((price - salePrice) / price) * 100) : 0;

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!divRef.current) return;
    const rect = divRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    divRef.current.style.setProperty("--mouse-x", `${x}px`);
    divRef.current.style.setProperty("--mouse-y", `${y}px`);
  };

  const [userId, setUserId] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const router = useRouter();

  // Busca userId e token logo ao montar
  useEffect(() => {
    (async () => {
      try {
        // 1. Verifica se está autenticado
        const authRes = await fetch("/api/auth/status", { cache: "no-store" });
        const authData = await authRes.json();

        if (!authData.isAuthenticated) {
          router.push("/");
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

  // Agora o handleAddToCart não precisa do if (!userId)
  const handleAddToCart = async (e?: React.MouseEvent) => {
    e?.stopPropagation(); 
    setLoading(true);
    try {
      await updateCart(
        userId!, // já garantido pelo useEffect
        [{ productId: id, quantity: 1 }],
        token // passa o token também
      );
      alert("Adicionado!");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };


  return (
    <>
      {/* CARD REDUZIDO */}
      <div
        ref={divRef}
        onMouseMove={handleMouseMove}
        className="group relative flex flex-col h-full overflow-hidden rounded-[20px] bg-zinc-900 border border-zinc-800 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-purple-900/20 cursor-pointer"
        onClick={() => setIsOpen(true)}
      >
        <div
          className="pointer-events-none absolute -inset-px opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 rounded-[20px]"
          style={{
            background: `radial-gradient(600px circle at var(--mouse-x) var(--mouse-y), rgba(139, 92, 246, 0.1), transparent 40%)`,
          }}
        />

        {/* --- LÓGICA DA BARRA SUPERIOR (SALE VS NORMAL) --- */}
        {hasDiscount ? (
          // Barra de Promoção (Vermelha) com Texto
          <div className="absolute top-0 left-0 right-0 h-7 bg-linear-to-r from-red-600 to-rose-600 z-20 flex items-center justify-center">
             <span className="text-[10px] font-bold text-white uppercase tracking-wider flex items-center gap-1">
               <TimerIcon /> Oferta por tempo limitado
             </span>
          </div>
        ) : (
          // Barra Decorativa Padrão (Roxa)
          <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-purple-600 to-blue-600 z-20" />
        )}

        <div className={`relative aspect-video w-full overflow-hidden bg-zinc-800 ${hasDiscount ? 'mt-6' : ''}`}> 
        {/* Adicionei margem top se tiver a barra de promoção para não cobrir a imagem */}
        
          <Image
            src={image}
            alt={name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          
          <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md px-2 py-1 rounded-md border border-white/10 text-[10px] font-bold uppercase tracking-wider text-white flex items-center gap-1">
             <GamepadIcon /> {category}
          </div>

          {/* BADGE DE DESCONTO (-30%) */}
          {hasDiscount && (
             <div className="absolute bottom-3 right-3 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded shadow-lg animate-pulse">
                -{discountPercentage}%
             </div>
          )}
        </div>

        <div className="relative flex flex-col grow p-4 z-20 bg-zinc-900">
          <h3 className="text-base font-bold text-white line-clamp-1 mb-1" title={name}>
            {name}
          </h3>
          
          <p className="text-xs text-zinc-500 font-medium mb-4">
            Lançamento: 2025
          </p>

          <div className="mt-auto flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-xs text-zinc-400">A partir de</span>
              
              {/* PREÇO COM PROMOÇÃO */}
              <div className="flex items-baseline gap-2">
                {hasDiscount && (
                  <span className="text-xs text-zinc-500 line-through decoration-red-500/50">
                    R$ {price.toFixed(2)}
                  </span>
                )}
                <span className={`text-lg font-bold ${hasDiscount ? 'text-red-400' : 'text-white'}`}>
                  R$ {currentPrice?.toFixed(2)}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">        
              <button 
                onClick={handleAddToCart}
                disabled={loading}
                className={`p-2 rounded-full text-black transition-all transform active:scale-90 ${hasDiscount ? 'bg-red-500 hover:bg-red-400 text-white' : 'bg-white hover:bg-purple-500 hover:text-white'}`}
                title="Adicionar ao Carrinho"
              >
               <PlusIcon />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL EXPANDIDO */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
            onClick={() => setIsOpen(false)}
          />
          
          <div className="relative w-full max-w-4xl bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row animate-in fade-in zoom-in duration-200">
            
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 z-50 p-2 bg-black/50 backdrop-blur rounded-full text-white hover:bg-white hover:text-black transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 18 12"/></svg>
            </button>

            <div className="relative w-full md:w-1/2 aspect-video md:aspect-auto bg-zinc-950">
              <Image
                src={image}
                alt={name}
                fill
                className="object-cover opacity-90"
              />
              <div className="absolute inset-0 bg-linear-to-t from-zinc-900 via-transparent to-transparent md:bg-linear-to-r" />
              
              {/* Badge de Promoção no Modal */}
              {hasDiscount && (
                 <div className="absolute top-4 left-4 bg-red-600 text-white font-bold px-3 py-1 rounded-lg shadow-xl z-20">
                    OFERTA -{discountPercentage}%
                 </div>
              )}
            </div>

            <div className="flex flex-col p-6 md:p-8 md:w-1/2 bg-zinc-900">
              <div className="mb-auto">
                <span className="inline-block px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 text-xs font-bold uppercase tracking-wider mb-4 border border-purple-500/20">
                  {category}
                </span>
                
                <h2 className="text-3xl font-bold text-white mb-2 leading-tight">
                  {name}
                </h2>
                
                <div className={`h-1 w-20 rounded-full mb-6 ${hasDiscount ? 'bg-linear-to-r from-red-600 to-rose-600' : 'bg-linear-to-r from-purple-600 to-blue-600'}`} />
                
                <p className="text-zinc-400 text-sm leading-relaxed mb-6">
                  {description}
                </p>
              </div>

              <div className="border-t border-zinc-800 pt-6 mt-6">
                <div className="flex items-end justify-between mb-6">
                   <div>
                      <p className="text-sm text-zinc-500">
                        {hasDiscount ? "Preço Promocional" : "Preço Atual"}
                      </p>
                      
                      <div className="flex items-baseline gap-3">
                        {hasDiscount && (
                            <span className="text-lg text-zinc-600 line-through">
                                R$ {price.toFixed(2)}
                            </span>
                        )}
                        <p className={`text-3xl font-bold ${hasDiscount ? 'text-red-500' : 'text-white'}`}>
                            R$ {currentPrice?.toFixed(2)}
                        </p>
                      </div>
                   </div>
                   <div className="text-right">
                      <div className="flex text-yellow-500 text-sm">★★★★★</div>
                      <p className="text-xs text-zinc-500">Avaliação máxima</p>
                   </div>
                </div>

                <button
                  onClick={handleAddToCart}
                  disabled={loading}
                  className={`w-full group relative overflow-hidden rounded-xl font-bold py-4 transition-all ${
                    hasDiscount 
                      ? 'bg-red-600 hover:bg-red-700 text-white' // Com desconto: Fundo Vermelho, Texto Branco
                      : 'bg-white text-black hover:bg-purple-600 hover:text-white' // Sem desconto: Fundo Branco, Texto Preto (vira branco no hover)
                  }`}
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {loading ? "Adicionando..." : "Comprar Agora"}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}