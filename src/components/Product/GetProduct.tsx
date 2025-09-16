// @/component/Product/GetProduct.tsx

import prisma from "@/lib/prisma";

export default async function GetProduct() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
  });

  if (products.length === 0) {
    return (
      <p className="text-gray-600 dark:text-gray-300">
        Nenhum produto cadastrado.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <div
          key={product.id}
          className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 shadow-sm 
                     bg-white dark:bg-gray-800 hover:shadow-md transition"
        >
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            {product.name}
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            {product.description}
          </p>

          <div className="mt-2">
            {product.sale && product.salePrice ? (
              <p className="text-red-600 dark:text-red-400 font-bold">
                R$ {product.salePrice.toFixed(2)}{" "}
                <span className="line-through text-gray-500">
                  R$ {Number(product.price).toFixed(2)}
                </span>
              </p>
            ) : (
              <p className="text-gray-900 dark:text-gray-100 font-bold">
                R$ {Number(product.price).toFixed(2)}
              </p>
            )}
          </div>

          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            Quantidade em estoque: {product.quantity}
          </p>
        </div>
      ))}
    </div>
  );
}
