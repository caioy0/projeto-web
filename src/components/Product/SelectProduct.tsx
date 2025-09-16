// @/components/CreateProduct/SelectProduct.tsx

type Product = {
  id: string;
  name: string;
  description: string;
};

export default function SelectProduct({
  products,
  onChange,
}: {
  products: Product[];
  onChange: (id: string) => void;
}) {
  return (
    <div className="mb-6">
      <label
        htmlFor="productId"
        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
      >
        Product *
      </label>
      <select
        id="productId"
        name="productId"
        required
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
                   focus:outline-none focus:ring-2 focus:ring-blue-500 
                   dark:bg-gray-700 dark:text-white"
      >
        <option value="">Select a product</option>
        {products.map((product) => (
          <option key={product.id} value={product.id}>
            {product.id} - {product.name} — {product.description}
          </option>
        ))}
      </select>
    </div>
  );
}
