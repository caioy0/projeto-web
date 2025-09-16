// @/components/Product/PutProduct.tsx
'use client'
import { updateProduct } from "@/actions/product";

type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  sale: boolean;
  salePrice: number | null;
};

export default function PutProduct({ product }: { product: Product }) {
  return (
    <div className="w-full max-w-lg bg-red-300 shadow-lg rounded-lg p-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Update Product</h1>

      <form action={updateProduct.bind(null, product.id)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Name</label>
          <input
            type="text"
            name="name"
            defaultValue={product.name}
            className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            name="description"
            defaultValue={product.description}
            className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Price</label>
          <input
            type="number"
            step="0.01"
            name="price"
            defaultValue={product.price}
            className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Quantity</label>
          <input
            type="number"
            name="quantity"
            defaultValue={product.quantity}
            className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            name="sale"
            defaultChecked={product.sale}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label className="text-sm font-medium text-gray-700">On Sale</label>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Sale Price</label>
          <input
            type="number"
            step="0.01"
            name="salePrice"
            defaultValue={product.salePrice ?? ""}
            className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
        >
          Update
        </button>
      </form>
    </div>
  );
}
