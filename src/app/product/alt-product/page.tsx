// src/app/product/alt-product/page.tsx
import Header from "@/components/Header";
import SelectProduct from "@/components/Product/SelectProduct";
import prisma from "@/lib/prisma";

type ProductSummary = {
  id: string;
  name: string;
  description: string;
};

export default async function PutProductPage() {
  const products: ProductSummary[] = await prisma.product.findMany({
    select: {
      id: true,
      name: true,
      description: true,
    },
  });
  
  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <Header />
      <div className="bg-amber-50"> 
        <SelectProduct products={products} />

      </div>
    </main>
  );
}