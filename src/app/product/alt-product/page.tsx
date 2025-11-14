// @/app/product/alt-product/page.tsx

import Header from "@/components/Header";
import SelectProduct from "@/components/Product/SelectProduct";
import DelProduct from "@/components/Product/DelProduct";
import prisma from "@/lib/prisma";

type ProductSummary = {
  id: string;
  name: string;
  description: string;
};

export default async function PutProductPage() {
  const products = await fetchProducts();

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <Header />

      <section className="bg-amber-50">
        <SelectProduct products={products} />
      </section>

      <ProductList products={products} />
    </main>
  );
}

/* -----------------------------------------------
 * Fetch de Produtos  
 * --------------------------------------------- */
async function fetchProducts(): Promise<ProductSummary[]> {
  return prisma.product.findMany({
    select: {
      id: true,
      name: true,
      description: true,
    },
  });
}

/* -----------------------------------------------
 * Component: Lista de Produtos
 * --------------------------------------------- */
function ProductList({ products }: { products: ProductSummary[] }) {
  return (
    <section className="max-w-3xl mx-auto mt-6 space-y-4">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
        Produtos
      </h2>

      {products.length === 0 ? (
        <NoProductsMessage />
      ) : (
        products.map((product) => <ProductItem key={product.id} product={product} />)
      )}
    </section>
  );
}

/* -----------------------------------------------
 * Component: Item da lista
 * --------------------------------------------- */
function ProductItem({ product }: { product: ProductSummary }) {
  return (
    <div className="flex items-center justify-between bg-white dark:bg-gray-800 p-4 shadow-sm rounded-md border border-gray-200 dark:border-gray-700">
      <div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
          {product.name}
        </h3>

        <p className="text-gray-600 dark:text-gray-300 text-sm">
          {product.description || "Sem descrição"}
        </p>
      </div>

      <DelProduct id={product.id} />
    </div>
  );
}

/* -----------------------------------------------
 * Component: Mensagem sem produtos
 * --------------------------------------------- */
function NoProductsMessage() {
  return (
    <p className="text-gray-600 dark:text-gray-300">
      Nenhum produto cadastrado.
    </p>
  );
}
