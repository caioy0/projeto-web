// src/app/product/alt-product/page.tsx
import Header from "@/components/Header";
import AltProductClient from "@/components/Product/PutProduct";

export default async function AltProductPage() {

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <Header />
      <AltProductClient/>
    </main>
  );
}
