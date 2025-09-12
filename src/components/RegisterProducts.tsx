// src/components/RegisterProducts.tsx
import { createProduct } from "@/actions/actions";

export default async function RegisterProductsPage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          Register New Product
        </h1>

        <form action={createProduct} className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Product Name *
              </label>
              <input type="text" id="name" name="name" required
                     className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"/>
            </div>

            <div className="md:col-span-2">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Description *
              </label>
              <textarea id="description" name="description" required rows={3}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"/>
            </div>

            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Price (RS) *
              </label>
              <input type="number" id="price" name="price" required min="0" step="0.01"
                     className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"/>
            </div>

            <div>
              <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Quantity *
              </label>
              <input type="number" id="quantity" name="quantity" required min="0"
                     className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"/>
            </div>

            <div>
              <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Category *
              </label>
              <select id="categoryId" name="categoryId" required
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white">
                <option value="">Select a category</option>
                <option value="cafe">Coffee</option>
                <option value="lamen">Ramen</option>
                <option value="bebida">Drinks</option>
                <option value="coreana">Korean Food</option>
              </select>
            </div>

            <div className="flex items-center">
              <input type="checkbox" id="sale" name="sale"
                     className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"/>
              <label htmlFor="sale" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                On Sale
              </label>
            </div>

            <div>
              <label htmlFor="salePrice" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Sale Price (RS)
              </label>
              <input type="number" id="salePrice" name="salePrice" min="0" step="0.01"
                     className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"/>
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-4">
            <button type="reset"
                    className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600">
              Cancel
            </button>
            <button type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">
              Create Product
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
