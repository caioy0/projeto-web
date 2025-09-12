// src/app/register-product/page.tsx

import React from 'react';
import Header from '@/components/Header';
import RegisterProducts from '@/components/RegisterProducts';
//import PostPage from '@/components/RegProdServer'

export default function RegisterProductPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      <RegisterProducts />
    </div>
  );
}
