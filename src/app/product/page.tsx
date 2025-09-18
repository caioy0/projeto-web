// @/app/product/create-product/page.tsx
import Link from "next/link";
import Header from "@/components/Header";

export default function ProductsPage() {
  return (
    <main className="min-h-screen bg-white">
      <Header />

      <div className="max-w-3xl mx-auto px-6 py-12">
        <h1 className="text-2xl font-semibold text-gray-900 mb-10">
          Dashboard de Produtos
        </h1>

        <div className="grid gap-6 sm:grid-cols-2">
          <Link href="/product/create-product">
            <div className="cursor-pointer rounded-xl border border-gray-200 bg-gray-50 p-6 text-center shadow-sm hover:shadow-md transition">
              <span className="block text-lg font-medium text-gray-900">
                Criar Produto
              </span>
            </div>
          </Link>

          <Link href="/product/create-category">
            <div className="cursor-pointer rounded-xl border border-gray-200 bg-gray-50 p-6 text-center shadow-sm hover:shadow-md transition">
              <span className="block text-lg font-medium text-gray-900">
                Criar Categoria
              </span>
            </div>
          </Link>

          <Link href="/product/alt-product">
            <div className="cursor-pointer rounded-xl border border-gray-200 bg-gray-50 p-6 text-center shadow-sm hover:shadow-md transition">
              <span className="block text-lg font-medium text-gray-900">
                Alterar Produto
              </span>
            </div>
          </Link>
        </div>
      </div>
    </main>
  );
}
