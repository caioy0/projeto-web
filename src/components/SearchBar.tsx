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
    <div className="w-full max-w-md">
      <label htmlFor="search" className="sr-only">
        Buscar
      </label>
      <input
        type="text"
        id="search"
        name="search"
        placeholder="Buscar produtos..."
        className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        defaultValue={search}
        onChange={(e) => handleSearch(e.target.value)}
      />
    </div>
  )
}
