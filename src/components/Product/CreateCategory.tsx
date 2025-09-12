// @/components/CreateCategory/CreateCategory.tsx
import { createCategory } from "@/actions/actions";

export default function CreateCategoryPage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          Register New Category
        </h1>
        <form action={createCategory} method="post" className="flex gap-2">
          <input
            type="text"
            name="name"
            required
            className="border p-2 rounded flex-1 dark:bg-gray-700 dark:text-white"
            placeholder="Category name"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Create Category
          </button>
        </form>
      </div>
    </main>
  );
}
