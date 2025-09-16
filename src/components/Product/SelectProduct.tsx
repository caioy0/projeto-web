// @/components/CreateProduct/SelectProduct.tsx
'use client';
import { useState } from "react";
import PutProduct from "./PutProduct";

type ProductSummary = {
  id: string;
  name: string;
  description: string;
};

type FullProduct = ProductSummary & {
  price: number;
  quantity: number;
  sale: boolean;
  salePrice: number | null;
};

export default function SelectProduct({ products, onSelect }: { products: ProductSummary[], onSelect?: (p: FullProduct) => void }) {
  const [selectedProduct, setSelectedProduct] = useState<FullProduct | null>(null);

  // Aqui você pode receber o produto do servidor já preenchido via props ou RSC
  const handleChange = async (event: React.ChangeEvent<HTMLSelectElement>) => {
    const id = event.target.value;
    if (!id) return;

    // Se você tiver os dados completos no servidor, pode buscar do lado cliente
    // ou passar diretamente via props. Aqui vamos usar placeholder:
    const product = products.find(p => p.id === id);
    if (!product) return;

    // Para um formulário de edição completo, precisaria dos outros campos
    setSelectedProduct({ ...product, price: 0, quantity: 0, sale: false, salePrice: null });

    onSelect?.({ ...product, price: 0, quantity: 0, sale: false, salePrice: null });
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        Select Product
      </label>
      <select
        onChange={handleChange}
        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
      >
        <option value="">Select a product</option>
        {products.map(p => (
          <option key={p.id} value={p.id}>
            {p.name} — {p.description}
          </option>
        ))}
      </select>

      {selectedProduct && (
        <div className="mt-6">
          <PutProduct product={selectedProduct} />
        </div>
      )}
    </div>
  );
}
