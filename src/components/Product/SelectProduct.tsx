// @/components/CreateProduct/SelectProduct.tsx
'use client';

import { useState, useEffect } from "react";
import { useDebouncedCallback } from "use-debounce";
import PutProduct from "@/components/Product/PutProduct";

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

  /** --------------------------------------------
   *  Filtragem dos produtos (debounced)
   * -------------------------------------------- */
  const filterProducts = useDebouncedCallback((value: string) => {
    const lower = value.toLowerCase();
    const results = products.filter(
      (p) =>
        p.name.toLowerCase().includes(lower) ||
        p.description.toLowerCase().includes(lower)
    );
    setFiltered(results);
  }, 200);

  /** --------------------------------------------
   *  Cria um FullProduct (baseado no Summary)
   * -------------------------------------------- */
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

  /** --------------------------------------------
   *  Quando o usuário seleciona um item
   * -------------------------------------------- */
  const handleSelect = (product: ProductSummary) => {
    const full = generateFullProduct(product);

    setSelectedProduct(full);
    setQuery(product.name);
    setShowList(false);
    setIsEditing(false);

    onSelect?.(full);
  };

  /** --------------------------------------------
   *  Fecha dropdown ao clicar fora
   * -------------------------------------------- */
  useEffect(() => {
    const handleClickOutside = () => setShowList(false);
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <div className="relative w-full max-w-md" onClick={(e) => e.stopPropagation()}>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        Buscar Produto
      </label>

      {/* Search Input */}
      <input
        type="text"
        value={query}
        placeholder="Digite para buscar..."
        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
        onChange={(e) => {
          setQuery(e.target.value);
          setShowList(true);
          filterProducts(e.target.value);
        }}
      />

      {/* Dropdown results */}
      {showList && query.length > 0 && (
        <ul className="absolute z-20 w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md mt-1 max-h-60 overflow-auto shadow-lg">
          {filtered.length === 0 && (
            <li className="px-3 py-2 text-sm text-gray-500">
              Nenhum produto encontrado.
            </li>
          )}

          {filtered.map((p) => (
            <SearchResultItem key={p.id} product={p} onSelect={handleSelect} />
          ))}
        </ul>
      )}

      {/* Botão de alterar produto */}
      {selectedProduct && !isEditing && (
        <button
          onClick={() => setIsEditing(true)}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700"
        >
          Alterar Produto
        </button>
      )}

      {/* Formulário de edição */}
      {selectedProduct && isEditing && (
        <div className="mt-6">
          <PutProduct product={selectedProduct} />
        </div>
      )}
    </div>
  );
}

/* --------------------------------------------
 * Componente de item do dropdown
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
      className="cursor-pointer px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
    >
      <span className="font-semibold">{product.name}</span>
      <span className="text-sm text-gray-600 dark:text-gray-400">
        {" — " + (product.description || "Sem descrição")}
      </span>
    </li>
  );
}
