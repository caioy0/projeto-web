// src/components/Card.tsx
// itens cards
import { useState } from "react"
import Image from "next/image"
type CardProps = {
    id: number
    name: string
    price: number
    image: string
    category: string
    description: string
  }
  
  export function Card({ name, price, image, description }: CardProps) {
    const [isOpen, setIsOpen] = useState(false)
    return (
      <>
      <div
        className="bg-white rounded-2xl shadow-md p-4 cursor-pointer hover:scale-105 transition"
        onClick={() => setIsOpen(true)}
      >
        <Image src={image} alt={name} className="rounded-xl w-full h-40 object-cover" />
        <h3 className="text-lg font-semibold mt-2">{name}</h3>
        <p className="text-gray-500 font-semibold">R$ {price}</p>
      </div>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={() => setIsOpen(false)} 
        >
        <div
          className="bg-white rounded-2xl p-6 max-w-md w-full relative shadow-lg"
          onClick={(e) => e.stopPropagation()} 
        >
          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-2 right-4 text-gray-500 text-4xl font-bold hover:scale-105 hover:text-red-600 transition"
          >
            &times;
          </button>
          <Image src={image} alt={name} className="rounded-xl w-full h-52 object-cover mb-4" />
          <h2 className="text-xl font-bold mb-2">{name}</h2>
          <p className="text-gray-600 mb-4">{description}</p>
          <p className="text-lg font-semibold">R$ {price}</p>
        </div>
      </div>
      )}
    </>
  )
  }
  