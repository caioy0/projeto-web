// src/components/Cards.tsx
'use client'

import { useState, TransitionEvent, useRef, MouseEvent } from "react";
import Image from "next/image";
import { updateCart } from "@/actions/cart"; // importa a server action

type CardProps = {
  id: string
  name: string
  price: number
  image: string
  category?: string
  description: string
  userId?: string // precisa receber o userId do usuário logado
}

export function Card({ id, name, price, image, description, userId }: CardProps) {
  const [isOpen, setIsOpen] = useState(false)
  const divRef = useRef<HTMLDivElement>(null);
  const [isFocused, setIsFocused] = useState(false);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!divRef.current) return;

    const rect = divRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    divRef.current.style.setProperty("--mouse-x", `${x}px`);
    divRef.current.style.setProperty("--mouse-y", `${y}px`);
  };

  const handleMouseEnter = () => {
    setIsFocused(true);
    divRef.current?.style.setProperty("--opacity", "1");
  };

  const handleMouseLeave = () => {
    setIsFocused(false);
    divRef.current?.style.setProperty("--opacity", "0");
  };
  const [loading, setLoading] = useState(false)

  const handleAddToCart = async () => {
    if (!userId) {
      alert("Você precisa estar logado para adicionar ao carrinho.");
      return;
    }

    setLoading(true);
    try {
      // adiciona 1 unidade do produto
      await updateCart(userId, [{ productId: id, quantity: 1 }]);
      alert("Produto adicionado ao carrinho!");
    } catch (err) {
      console.error("Erro ao adicionar ao carrinho:", err);
      alert("Erro ao adicionar ao carrinho.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div
        ref={divRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="group relative overflow-hidden rounded-2xl border border-gray-800 bg-gray-950/50 p-4 cursor-pointer transition-all duration-300 hover:border-purple-500/30 hover:scale-105 hover:shadow-xl hover:shadow-purple-500/10"
        onClick={() => setIsOpen(true)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            setIsOpen(true)
          }
        }}
      >
        <div
          className="pointer-events-none absolute -inset-px transition-opacity duration-300 z-0 rounded-2xl"
          style={{
            opacity: isFocused ? 1 : 0,
            background: `radial-gradient(600px circle at var(--mouse-x) var(--mouse-y), rgba(124, 58, 237, 0.15), transparent 40%)`,
          }}
        />

        <div className="relative z-10">
          <div className="relative w-full h-40 rounded-xl overflow-hidden bg-gray-900/50">
            <Image
              src={image}
              alt={name}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
          
          <h3 className="text-lg font-medium mt-3 text-white">
            {name}
          </h3>
          
          <p className="text-gray-300 font-semibold mt-1">
            R$ {price.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Modal */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          <div
            className="bg-gray-900 border border-gray-700 rounded-2xl p-6 max-w-md w-full relative shadow-2xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-gray-400 text-2xl hover:text-red-400 transition-colors"
              aria-label="Fechar modal"
            >
              &times;
            </button>
            
            <div className="relative w-full h-52 rounded-xl overflow-hidden mb-4 bg-gray-800">
              <Image
                src={image}
                alt={name}
                fill
                sizes="400px"
                className="object-cover"
              />
            </div>
            
            <h2 id="modal-title" className="text-xl font-bold mb-2 text-white">
              {name}
            </h2>
            
            <p className="text-gray-300 mb-4">
              {description}
            </p>
            
            <p className="text-lg font-bold text-purple-400">
              R$ {price.toFixed(2)}
            </p>

            {/* Botão de adicionar ao carrinho */}
            <button
              onClick={handleAddToCart}
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition disabled:opacity-50"
            >
              {loading ? "Adicionando..." : "Adicionar ao carrinho"}
            </button>
          </div>
        </div>
      )}
    </>
  )
}
