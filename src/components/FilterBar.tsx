// src/components/FilterBar.tsx
'use client'

import { useRouter, useSearchParams } from 'next/navigation';

type FilterProps = {
  category: string;
  search: string;
};

export default function Filter({ category, search }: FilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleCategoryChange = (newCategory: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (search) {
      params.set('search', search);
    } else {
      params.delete('search');
    }

    if (newCategory !== 'none') {
      params.set('category', newCategory);
    } else {
      params.delete('category');
    }

    router.push(`/?${params.toString()}`);
  };

  // Get all unique categories from your products
  const categories = [
    { value: 'none', label: 'Remove' },
    { value: 'jj', label: 'wompwomp' },
    { value: 'character', label: 'dbz' },
    { value: 'beverages', label: 'beverages' }
  ];

  return (
    <div className="flex flex-wrap justify-end gap-2 mb-4 font-bold">
      {categories.map((cat) => (
        <button
          key={cat.value}
          className={`px-4 py-2 rounded transition-colors ${
            category === cat.value 
              ? 'bg-gray-800 text-white' 
              : 'bg-white text-black hover:bg-gray-200'
          }`}
          onClick={() => handleCategoryChange(cat.value)}
        >
          {cat.label}
        </button>
      ))}
    </div>
  );
}