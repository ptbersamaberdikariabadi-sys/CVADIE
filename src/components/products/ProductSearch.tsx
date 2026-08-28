'use client'

import { Search } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useEffect } from 'react'

export default function ProductSearch() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const qParam = searchParams.get('q') || ''
  const [query, setQuery] = useState(qParam)
  const [prevParam, setPrevParam] = useState(qParam)

  // Sync state if URL changes externally (e.g. back button)
  if (qParam !== prevParam) {
    setPrevParam(qParam)
    setQuery(qParam)
  }

  // Debounce the update to URL
  useEffect(() => {
    const timer = setTimeout(() => {
      if (query !== (searchParams.get('q') || '')) {
        const params = new URLSearchParams(searchParams.toString())
        if (query.trim()) {
          params.set('q', query.trim())
        } else {
          params.delete('q')
        }
        router.push(`/products?${params.toString()}`)
      }
    }, 500)

    return () => clearTimeout(timer)
  }, [query, router, searchParams])

  return (
    <div className="relative w-full max-w-md">
      <input 
        type="text" 
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Cari part number atau tipe barang..." 
        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:border-brand-primary focus:ring-brand-primary text-black"
      />
      <Search className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
    </div>
  )
}
