// @/components/CreateProduct/SelectCategory.tsx
type Category = {
  id: string;
  name: string;
};

export default function CategorySelect({ categories }: { categories: Category[] }) {
  return (
    <div>
      <label
        htmlFor="categoryId"
        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
      >
        Category *
      </label>
      <select
        id="categoryId"
        name="categoryId"
        required
        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
                   focus:outline-none focus:ring-2 focus:ring-blue-500 
                   dark:bg-gray-700 dark:text-white"
      >
        <option value="">Select a category</option>
        {categories.map((cat) => (
          <option key={cat.id} value={cat.id}>
            {cat.name}
          </option>
        ))}
      </select>
    </div>
  );
}