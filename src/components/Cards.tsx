// src/components/Cards.tsx
'use client'

import { useState } from "react";
import Image from "next/image";

type CardProps = {
  id: string
  name: string
  price: number
  image: string
  category?: string
  description: string
}

export function Card({ name, price, image, description }: CardProps) {
  const [isOpen, setIsOpen] = useState(false)
  
  return (
    <>
      <div
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-4 cursor-pointer hover:scale-105 transition duration-300 border border-gray-200 dark:border-gray-700"
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
        <div className="relative w-full h-40 rounded-xl overflow-hidden">
          <Image
            src={image}
            alt={name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover"
          />
        </div>
        
        <h3 className="text-lg font-semibold mt-3 text-gray-900 dark:text-white">
          {name}
        </h3>
        
        <p className="text-gray-700 dark:text-gray-300 font-semibold mt-1">
          R$ {price.toFixed(2)}
        </p>
      </div>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
          onClick={() => setIsOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          <div
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-md w-full relative shadow-lg max-h-[90vh] overflow-y-auto border border-gray-300 dark:border-gray-600"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-gray-500 dark:text-gray-400 text-3xl font-bold hover:text-red-500 dark:hover:text-red-400 transition-colors"
              aria-label="Fechar modal"
            >
              &times;
            </button>
            
            <div className="relative w-full h-52 rounded-xl overflow-hidden mb-4">
              <Image
                src={image}
                alt={name}
                fill
                sizes="400px"
                className="object-cover"
              />
            </div>
            
            <h2 id="modal-title" className="text-xl font-bold mb-2 text-gray-900 dark:text-white">
              {name}
            </h2>
            
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              {description}
            </p>
            
            <p className="text-lg font-semibold text-gray-800 dark:text-white">
              R$ {price.toFixed(2)}
            </p>
          </div>
        </div>
      )}
    </>
  )
}