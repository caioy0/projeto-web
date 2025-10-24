// @/component/Product/GetProduct.tsx
import prisma from "@/lib/prisma";
import { Card } from "@/components/Cards";

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
        <Card
          key={product.id}
          id={product.id}
          name={product.name}
          price={Number(product.price)}
          image={product.image ?? "/placeholder.png"}
          description={product.description ?? ""}
          category={product.categoryId ?? " "}
        />
      ))}
    </div>
  );
}
