// src/components/SearchBar.tsx
'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useDebouncedCallback } from 'use-debounce'

type Props = {
  search?: string
  category?: string
}

export default function SearchBar({ search = '', category = 'none' }: Props) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams.toString())

    // search param
    if (term) {
      params.set('search', term)
    } else {
      params.delete('search')
    }

    // category param
    if (category && category !== 'none') {
      params.set('category', category)
    } else {
      params.delete('category')
    }

    router.push(`/?${params.toString()}`)
  }, 300)

  return (
    <div className="w-full max-w-md relative group">
      <label htmlFor="search" className="sr-only">
        Buscar
      </label>
      <input
        type="text"
        id="search"
        name="search"
        placeholder="Buscar produtos..."
        className="w-full py-2 bg-transparent text-white placeholder-gray-300 border-b border-gray-500 focus:border-white focus:outline-none transition-colors duration-300 ease-in-out text-lg"
        defaultValue={search}
        onChange={(e) => handleSearch(e.target.value)}
      />
      <div className="absolute right-0 top-3 text-gray-300 pointer-events-none group-focus-within:text-white transition-colors duration-300">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
    </div>
  )
}