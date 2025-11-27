// @/components/CreateProduct/SelectProduct.tsx
'use client';

import { useState, useEffect, useRef } from "react";
import { useDebouncedCallback } from "use-debounce";
import PutProduct from "@/components/Product/PutProduct";
import { Search, Edit, X, PackageSearch, ChevronRight } from "lucide-react";

import type { ProductSummary, FullProduct } from "@/types/product";

export default function SelectProduct({
  products,
  onSelect
}: {
  products: ProductSummary[];
  onSelect?: (p: FullProduct) => void;
}) {
  const [query, setQuery] = useState("");
  const [filtered, setFiltered] = useState<ProductSummary[]>(products);
  const [selectedProduct, setSelectedProduct] = useState<FullProduct | null>(null);
  const [showList, setShowList] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null);

  // Filtragem (Debounced)
  const filterProducts = useDebouncedCallback((value: string) => {
    const lower = value.toLowerCase();
    const results = products.filter(
      (p) =>
        p.name.toLowerCase().includes(lower) ||
        p.description.toLowerCase().includes(lower)
    );
    setFiltered(results);
  }, 200);
  
  const generateFullProduct = (data: ProductSummary): FullProduct => ({
    ...data,
    price: 0,
    sale: false,
    salePrice: null,
    quantity: 0,
    categoryId: "",
    createdAt: new Date(),
    updatedAt: new Date()
  });

  const handleSelect = (product: ProductSummary) => {
    const full = generateFullProduct(product);
    setSelectedProduct(full);
    setQuery(product.name);
    setShowList(false);
    setIsEditing(false);
    onSelect?.(full);
  };

  const handleClear = () => {
    setQuery("");
    setSelectedProduct(null);
    setIsEditing(false);
    setFiltered(products);
  };

  // Fecha dropdown ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowList(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="w-full max-w-2xl mx-auto space-y-6">
      
      {/* Search Input Wrapper */}
      <div className="relative group">
        <label className="block text-xs font-medium text-gray-400 mb-1.5 ml-1 uppercase tracking-wider">
          Buscar no Catálogo
        </label>
        
        <div className="relative">
          {/* Ícone de Busca */}
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500 group-focus-within:text-purple-400 transition-colors">
            <Search size={18} />
          </div>

          <input
            type="text"
            value={query}
            placeholder="Digite o nome do produto..."
            className="w-full pl-10 pr-10 py-3 bg-black/40 border border-white/10 rounded-xl text-gray-100 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all shadow-inner"
            onChange={(e) => {
              setQuery(e.target.value);
              setShowList(true);
              filterProducts(e.target.value);
              if (selectedProduct) {
                  // Se o usuário digita algo novo, limpa a seleção anterior para permitir nova busca
                  setSelectedProduct(null); 
                  setIsEditing(false);
              }
            }}
            onFocus={() => setShowList(true)}
          />

          {/* Botão Limpar (X) */}
          {query.length > 0 && (
            <button
              onClick={handleClear}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-red-400 transition-colors"
            >
              <X size={18} />
            </button>
          )}
        </div>

        {/* Dropdown de Resultados */}
        {showList && query.length > 0 && !selectedProduct && (
          <div className="absolute z-50 w-full mt-2 bg-[#0a0a0a] border border-white/10 rounded-xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2">
            <ul className="max-h-60 overflow-y-auto custom-scrollbar">
              {filtered.length === 0 ? (
                <li className="px-4 py-6 text-center text-gray-500 flex flex-col items-center gap-2">
                  <PackageSearch size={24} opacity={0.5} />
                  <span>Nenhum produto encontrado.</span>
                </li>
              ) : (
                filtered.map((p) => (
                  <SearchResultItem key={p.id} product={p} onSelect={handleSelect} />
                ))
              )}
            </ul>
          </div>
        )}
      </div>

      {/* Botão de Alterar (Aparece após seleção) */}
      {selectedProduct && !isEditing && (
        <div className="animate-in fade-in slide-in-from-top-2">
            <button
            onClick={() => setIsEditing(true)}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl hover:from-purple-500 hover:to-pink-500 hover:shadow-lg hover:shadow-purple-500/25 transition-all transform hover:-translate-y-0.5"
            >
            <Edit size={18} />
            Editar Detalhes do Produto
            </button>
            <p className="text-center text-xs text-gray-500 mt-2">
                Clique acima para abrir o formulário de edição completo.
            </p>
        </div>
      )}

      {/* Formulário de Edição (Renderizado Condicionalmente) */}
      {selectedProduct && isEditing && (
        <div className="mt-8 pt-8 border-t border-white/10 animate-in fade-in duration-500">
           {/* Cabeçalho da área de edição */}
           <div className="mb-6">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    Editando: <span className="text-purple-400">{selectedProduct.name}</span>
                </h3>
           </div>
           
           {/* Componente PutProduct (Assume-se que ele será renderizado aqui dentro) */}
           <div className="bg-white/5 border border-white/5 rounded-2xl p-6">
              <PutProduct product={selectedProduct} />
           </div>
        </div>
      )}
    </div>
  );
}

/* --------------------------------------------
 * Componente de Item do Dropdown
 * -------------------------------------------- */
function SearchResultItem({
  product,
  onSelect
}: {
  product: ProductSummary;
  onSelect: (p: ProductSummary) => void;
}) {
  return (
    <li
      onClick={() => onSelect(product)}
      className="cursor-pointer px-4 py-3 hover:bg-white/5 border-b border-white/5 last:border-0 transition-colors group flex items-center justify-between"
    >
      <div className="flex flex-col">
        <span className="font-semibold text-gray-200 group-hover:text-purple-300 transition-colors">
            {product.name}
        </span>
        <span className="text-xs text-gray-500 line-clamp-1">
            {product.description || "Sem descrição disponível"}
        </span>
      </div>
      
      <ChevronRight size={16} className="text-gray-600 group-hover:text-purple-400 transition-colors" />
    </li>
  );
}