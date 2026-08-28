'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Filter } from 'lucide-react'
import { generateSlug } from '@/utils/slugify'

type ProductSidebarProps = {
  cmsCategories: string[]
  uniqueBrands: string[]
}

export default function ProductSidebar({ cmsCategories, uniqueBrands }: ProductSidebarProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const selectedBrands = searchParams.getAll('brand')

  const handleBrandChange = (brand: string, checked: boolean) => {
    const params = new URLSearchParams(searchParams.toString())
    if (checked) {
      params.append('brand', brand)
    } else {
      // Remove this specific brand but keep others
      const brands = params.getAll('brand').filter(b => b !== brand)
      params.delete('brand')
      brands.forEach(b => params.append('brand', b))
    }
    // Also reset pagination if it exists (for future)
    router.push(`/products?${params.toString()}`)
  }

  return (
    <aside className="w-full md:w-64 shrink-0">
      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm sticky top-28">
        <div className="flex items-center gap-2 mb-6 text-brand-primary font-bold text-lg border-b pb-4">
          <Filter className="w-5 h-5" /> Filter Produk
        </div>
        
        <div className="mb-6">
          <h3 className="font-bold text-gray-900 mb-3">Kategori Spesifik</h3>
          <ul className="space-y-3 text-sm text-gray-600">
            {cmsCategories.length > 0 ? (
              cmsCategories.map((cat: string, idx: number) => (
                <li key={idx} className="flex items-center gap-2 cursor-pointer hover:text-brand-accent transition-colors">
                  <Link href={`/products/${generateSlug(cat)}`} className="flex-1 text-gray-600 hover:text-brand-accent transition-colors">
                    {cat}
                  </Link>
                </li>
              ))
            ) : (
              <li className="text-gray-400 italic">Belum ada kategori</li>
            )}
          </ul>
        </div>

        <div>
          <h3 className="font-bold text-gray-900 mb-3">Merek (Brands)</h3>
          <ul className="space-y-3 text-sm text-gray-600">
            {uniqueBrands.length > 0 ? (
              uniqueBrands.map((brand, idx) => {
                const isChecked = selectedBrands.includes(brand)
                return (
                  <li key={idx} className="flex items-center gap-2 cursor-pointer hover:text-brand-accent transition-colors">
                    <input 
                      type="checkbox" 
                      id={`brand-${idx}`}
                      checked={isChecked}
                      onChange={(e) => handleBrandChange(brand, e.target.checked)}
                      className="rounded text-brand-primary focus:ring-brand-primary w-4 h-4 cursor-pointer" 
                    />
                    <label htmlFor={`brand-${idx}`} className="cursor-pointer flex-1">
                      {brand}
                    </label>
                  </li>
                )
              })
            ) : (
              <li className="text-gray-400 italic">Belum ada merek</li>
            )}
          </ul>
        </div>
      </div>
    </aside>
  )
}
