// @/components/CreateProduct/RegisterProducts.tsx
import { createProduct } from "@/actions/product";
import prisma from "@/lib/prisma";
import CategorySelect from "./SelectCategory"; 
import { Save, X } from "lucide-react"; 

export default async function RegisterProductsPage() {
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
  });

  return (
    <div className="relative min-h-screen w-full flex justify-center pt-32 pb-12 px-4 sm:px-6 lg:px-8 bg-[#050505] text-gray-200 selection:bg-purple-500/30">
       
       <div className="fixed top-20 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-purple-900/20 rounded-full blur-[120px] -z-10 pointer-events-none" />

      <div className="w-full max-w-4xl">
        
        <div className="mb-10 text-center md:text-left animate-in fade-in slide-in-from-bottom-4 duration-700">
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-400 to-white w-fit mx-auto md:mx-0">
            Registrar Novo Produto
          </h1>
          <p className="mt-2 text-gray-400">
            Preencha os detalhes abaixo para adicionar um novo item ao inventário.
          </p>
        </div>

        <form 
          action={createProduct} 
          className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 shadow-2xl relative overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-700"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

            <div className="md:col-span-2 space-y-6">
              <h2 className="text-xs uppercase tracking-widest text-gray-500 font-bold border-b border-white/10 pb-2">
                Informações Básicas
              </h2>
              
              <div className="grid md:grid-cols-2 gap-6">

                <div className="md:col-span-2">
                  <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                    Nome do Produto <span className="text-purple-400">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    placeholder="Ex: Teclado Mecânico RGB"
                    className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-gray-100 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all"
                  />
                </div>

                <div className="md:col-span-2">
                  <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-2">
                    Descrição <span className="text-purple-400">*</span>
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    required
                    rows={4}
                    placeholder="Descreva as características principais do produto..."
                    className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-gray-100 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all resize-none"
                  />
                </div>
              </div>
            </div>

            <div className="md:col-span-2 space-y-6 mt-2">
              <h2 className="text-xs uppercase tracking-widest text-gray-500 font-bold border-b border-white/10 pb-2">
                Vendas & Estoque
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                <div>
                  <label htmlFor="price" className="block text-sm font-medium text-gray-300 mb-2">
                    Preço (R$) <span className="text-purple-400">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-3 text-gray-500">R$</span>
                    <input
                      type="number"
                      id="price"
                      name="price"
                      required
                      min="0"
                      step="0.01"
                      className="w-full pl-10 pr-4 py-3 bg-black/40 border border-white/10 rounded-xl text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="quantity" className="block text-sm font-medium text-gray-300 mb-2">
                    Quantidade em Estoque <span className="text-purple-400">*</span>
                  </label>
                  <input
                    type="number"
                    id="quantity"
                    name="quantity"
                    required
                    min="0"
                    className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
                  />
                </div>

                 <div>
                <label htmlFor="quantity" className="block text-sm font-medium text-gray-300 mb-2">
                Quantidade em Estoque <span className="text-purple-400">*</span>
                </label>
                <input
                type="number"
                id="quantity"
                name="quantity"
                required
                min="0"
                className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
                />
            </div>

            <div className="md:col-span-2">
                <CategorySelect categories={categories} />
            </div>
              </div>
            </div>

            <div className="md:col-span-2 bg-purple-500/5 border border-purple-500/10 rounded-xl p-6 mt-2 hover:bg-purple-500/10 transition-colors">
               <div className="flex items-center justify-between mb-4">
                  <label htmlFor="sale" className="text-sm font-medium text-gray-200 cursor-pointer select-none flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="sale"
                      name="sale"
                      className="w-5 h-5 rounded border-gray-600 text-purple-600 focus:ring-purple-500 bg-black/40"
                    />
                    Produto em Promoção?
                  </label>
               </div>

               <div>
                  <label htmlFor="salePrice" className="block text-sm font-medium text-gray-400 mb-2">
                    Preço Promocional (R$)
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-3 text-gray-600">R$</span>
                    <input
                      type="number"
                      id="salePrice"
                      name="salePrice"
                      min="0"
                      step="0.01"
                      placeholder="0.00"
                      className="w-full pl-10 pr-4 py-3 bg-black/40 border border-white/10 rounded-xl text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
                    />
                  </div>
               </div>
            </div>

          </div>

          <div className="mt-10 flex flex-col-reverse md:flex-row justify-end gap-4 pt-6 border-t border-white/10">
            <button
              type="reset"
              className="flex items-center justify-center gap-2 px-6 py-3 text-sm font-medium text-gray-400 bg-white/5 border border-white/5 rounded-xl hover:bg-white/10 hover:text-white transition-colors"
            >
              <X size={18} /> Cancelar
            </button>
            <button
              type="submit"
              className="flex items-center justify-center gap-2 px-8 py-3 text-sm font-bold text-white bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl hover:from-purple-500 hover:to-pink-500 hover:shadow-lg hover:shadow-purple-500/25 transition-all transform hover:-translate-y-0.5"
            >
              <Save size={18} /> Criar Produto
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}