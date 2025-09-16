// src/components/SearchBar.tsx
'use client'

import { useRouter, useSearchParams } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';

type Props = {
  search: string;
  category: string;
};

export default function SearchBar({ search, category }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (term) {
      params.set('search', term);
    } else {
      params.delete('search');
    }

    if (category && category !== 'none') {
      params.set('category', category);
    } else {
      params.delete('category');
    }

    router.push(`/?${params.toString()}`);
  }, 300);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    handleSearch(value);
  };

  return (
    <div>
      <label htmlFor="busca" className="sr-only">
        Search
      </label>
      <input
        type="text"
        id="search"
        name="search"
        placeholder="Search..."
        className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={search}
        onChange={handleChange}
      />
    </div>
  );
}
