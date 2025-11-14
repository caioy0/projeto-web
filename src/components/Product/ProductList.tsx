// @/components/Product/ProductsList.tsx
import prisma from "@/lib/prisma";
import { Card } from "@/components/Cards";

interface ProductsListProps {
  search?: string;
  category?: string;
}

export default async function ProductsList({ search, category }: ProductsListProps) {
  let products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
  });

  // filtro do search e category
  if (category && category !== "none") {
    products = products.filter(p => p.categoryId === category);
  }
  if (search) {
    products = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));
  }

  if (products.length === 0) {
    return (
      <p className="text-gray-600 dark:text-gray-300">
        Nenhum produto cadastrado.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {products.map(product => (
        <Card
          key={product.id}
          id={product.id}
          name={product.name}
          price={Number(product.price)}
          image={product.image ?? "/placeholder.jpg"}
          description={product.description ?? ""}
          category={product.categoryId} // ou category.name se você fizer include
        />
      ))}
    </div>
  );
}
