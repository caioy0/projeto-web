// src/components/FilterBar.tsx
'use client';

import { useRouter, useSearchParams } from 'next/navigation';

type FilterProps = {
  category: string;
  search: string;
  categories: { slug: string; name: string }[];
};

export default function Filter({ category, search,  }: FilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const categories = [
    { value: 'none', label: 'Todos' },
    { value: 'hardware', label: 'Hardware' },
    { value: 'games', label: 'Jogos' },
    { value: 'software', label: 'Software' }
  ];

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

  const currentActive = category || 'none';

  return (
    <div className="w-full flex justify-center items-center mt-12 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <div className="flex flex-wrap justify-center gap-1 p-1.5 bg-white/5 backdrop-blur-md border border-white/10 rounded-full shadow-lg">
        
        {categories.map((item) => {
          const isActive = currentActive === item.value;
          
          return (
            <button
              key={item.value}
              onClick={() => handleCategoryChange(item.value)}
              className={`
                relative px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ease-out
                focus:outline-none focus:ring-2 focus:ring-purple-500/50
                ${isActive 
                  ? 'bg-white text-black shadow-[0_0_15px_rgba(255,255,255,0.2)] scale-105 font-bold' 
                  : 'text-gray-400 hover:text-white hover:bg-white/10'
                }
              `}
            >
              {item.label}
            </button>
          );
        })}

      </div>
    </div>
  );
}