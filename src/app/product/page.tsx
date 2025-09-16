// @/app/product/create-product/page.tsx

import Link from "next/link";
import Header from "@/components/Header";

export default function ProductsPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-4xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">
          Products Dashboard
        </h1>

        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          <Link href="/product/create-product">
            <button className="w-full rounded-lg bg-blue-600 px-4 py-2 text-white font-medium shadow hover:bg-blue-700 transition">
              Go to Create Product
            </button>
          </Link>

          <Link href="/product/create-category">
            <button className="w-full rounded-lg bg-green-600 px-4 py-2 text-white font-medium shadow hover:bg-green-700 transition">
              Go to Create Category
            </button>
          </Link>

          <Link href="/product/alt-product">
            <button className="w-full rounded-lg bg-purple-600 px-4 py-2 text-white font-medium shadow hover:bg-purple-700 transition">
              Go to Alt Product
            </button>
          </Link>
        </div>
      </div>
    </main>
  );
}
