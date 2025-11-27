// @/components/Product/PutProduct.tsx
'use client'

import { updateProduct } from "@/actions/product";
import type { Product } from "@/types/product";
import { Save, DollarSign, Package, Tag, FileText, Type } from "lucide-react";

export default function PutProduct({ product }: { product: Product }) {
  return (
    <div className="w-full animate-in fade-in duration-500">
      
      <form action={updateProduct.bind(null, product.id)} className="space-y-6">
        
        <div className="space-y-1">
          <label className="text-xs font-medium text-gray-400 ml-1 uppercase tracking-wider flex items-center gap-2">
            <Type size={14} /> Nome do Produto
          </label>
          <input
            type="text"
            name="name"
            defaultValue={product.name}
            placeholder="Ex: Teclado Gamer Mecânico"
            className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-gray-100 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-medium text-gray-400 ml-1 uppercase tracking-wider flex items-center gap-2">
            <FileText size={14} /> Descrição Detalhada
          </label>
          <textarea
            name="description"
            defaultValue={product.description}
            rows={3}
            placeholder="Descreva as características do produto..."
            className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-gray-100 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all resize-none"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-400 ml-1 uppercase tracking-wider">
              Preço Base
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500 group-focus-within:text-purple-400 transition-colors">
                <DollarSign size={16} />
              </div>
              <input
                type="number"
                step="0.01"
                name="price"
                defaultValue={product.price}
                className="w-full pl-10 pr-4 py-3 bg-black/40 border border-white/10 rounded-xl text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-400 ml-1 uppercase tracking-wider">
              Estoque Atual
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500 group-focus-within:text-purple-400 transition-colors">
                <Package size={16} />
              </div>
              <input
                type="number"
                name="quantity"
                defaultValue={product.quantity}
                className="w-full pl-10 pr-4 py-3 bg-black/40 border border-white/10 rounded-xl text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
              />
            </div>
          </div>
        </div>

        <div className="bg-purple-500/5 border border-purple-500/10 rounded-xl p-5 hover:bg-purple-500/10 transition-colors">
          <div className="flex items-center gap-3 mb-4">
            <div className="relative flex items-center">
              <input
                type="checkbox"
                name="sale"
                id="saleCheck"
                defaultChecked={product.sale}
                className="peer h-5 w-5 cursor-pointer appearance-none rounded border border-gray-600 bg-black/40 checked:bg-purple-600 checked:border-purple-600 focus:ring-2 focus:ring-purple-500/50 transition-all"
              />
              <svg
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none opacity-0 peer-checked:opacity-100 text-white transition-opacity"
                viewBox="0 0 14 14"
                fill="none"
              >
                <path d="M3 7L6 10L11 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <label htmlFor="saleCheck" className="text-sm font-bold text-gray-200 cursor-pointer select-none">
              Produto em Promoção?
            </label>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-400 ml-1 uppercase tracking-wider flex items-center gap-2">
              <Tag size={14} /> Preço Promocional
            </label>
            <div className="relative group">
               <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500 group-focus-within:text-purple-400 transition-colors">
                <span className="text-xs font-bold">R$</span>
              </div>
              <input
                type="number"
                step="0.01"
                name="salePrice"
                defaultValue={product.salePrice ?? ""}
                placeholder="0.00"
                className="w-full pl-10 pr-4 py-3 bg-black/40 border border-white/10 rounded-xl text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
              />
            </div>
          </div>
        </div>

        <div className="pt-4">
          <button
            type="submit"
            className="w-full flex justify-center items-center gap-2 py-3.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl hover:from-purple-500 hover:to-pink-500 hover:shadow-lg hover:shadow-purple-500/25 transition-all transform hover:-translate-y-0.5"
          >
            <Save size={18} />
            Salvar Alterações
          </button>
        </div>

      </form>
    </div>
  );
}