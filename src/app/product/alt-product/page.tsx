// @/app/product/alt-product/page.tsx

import Header from "@/components/Header";
import SelectProduct from "@/components/Product/SelectProduct";
import DelProduct from "@/components/Product/DelProduct";
import prisma from "@/lib/prisma";
import { PackageOpen } from "lucide-react"; // Sugestão de ícone para estado vazio

type ProductSummary = {
  id: string;
  name: string;
  description: string;
};

export default async function PutProductPage() {
  const products = await fetchProducts();

  return (
    <main className="min-h-screen bg-[#050505] text-gray-100 pt-32 pb-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden selection:bg-purple-500/30">
      
      <div className="fixed top-20 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-purple-900/20 rounded-full blur-[120px] -z-10 pointer-events-none" />
      
      <Header />

      <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
        
        <div className="text-center md:text-left">
          <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-400 to-white mb-2">
            Gerenciar Produtos
          </h1>
          <p className="text-gray-400">
            Selecione um produto para editar seus detalhes ou remova itens do catálogo.
          </p>
        </div>

        <section className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 md:p-8 shadow-xl">
          <h2 className="text-xs uppercase tracking-widest text-gray-500 font-bold mb-6 border-b border-white/10 pb-2">
            Editar Produto Existente
          </h2>
          <div className="w-full">
            <SelectProduct products={products} />
          </div>
        </section>

        <ProductList products={products} />
      </div>
    </main>
  );
}

/* -----------------------------------------------
 * Fetch de Produtos  
 * --------------------------------------------- */
async function fetchProducts(): Promise<ProductSummary[]> {
  return prisma.product.findMany({
    select: {
      id: true,
      name: true,
      description: true,
    },
    orderBy: {
      name: 'asc'
    }
  });
}

/* -----------------------------------------------
 * Component: Lista de Produtos
 * --------------------------------------------- */
function ProductList({ products }: { products: ProductSummary[] }) {
  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-white">
          Catálogo Atual <span className="text-gray-500 text-sm font-normal ml-2">({products.length} itens)</span>
        </h2>
      </div>

      {products.length === 0 ? (
        <NoProductsMessage />
      ) : (
        <div className="grid gap-4">
          {products.map((product) => <ProductItem key={product.id} product={product} />)}
        </div>
      )}
    </section>
  );
}

/* -----------------------------------------------
 * Component: Item da lista (Card Estilizado)
 * --------------------------------------------- */
function ProductItem({ product }: { product: ProductSummary }) {
  return (
    <div className="group flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-black/40 border border-white/10 rounded-xl p-5 hover:bg-white/5 hover:border-purple-500/30 transition-all duration-300">
      <div className="flex-1 min-w-0"> {/* min-w-0 ajuda com truncamento de texto */}
        <h3 className="text-lg font-medium text-gray-100 group-hover:text-purple-300 transition-colors truncate">
          {product.name}
        </h3>
        
        <p className="text-gray-500 text-sm mt-1 line-clamp-1 group-hover:text-gray-400 transition-colors">
          {product.description || "Descrição não disponível"}
        </p>
      </div>

      <div className="flex items-center pl-0 sm:pl-4 sm:border-l border-white/10">
        <DelProduct id={product.id} />
      </div>
    </div>
  );
}

/* -----------------------------------------------
 * Component: Mensagem sem produtos
 * --------------------------------------------- */
function NoProductsMessage() {
  return (
    <div className="flex flex-col items-center justify-center py-16 bg-white/5 border border-dashed border-white/10 rounded-2xl text-center">
      <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
        <PackageOpen size={32} className="text-gray-500" />
      </div>
      <p className="text-lg font-medium text-gray-300">
        Nenhum produto encontrado
      </p>
      <p className="text-sm text-gray-500 mt-1">
        Comece adicionando novos itens ao seu inventário.
      </p>
    </div>
  );
}