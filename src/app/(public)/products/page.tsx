/* eslint-disable @typescript-eslint/no-explicit-any */
import { Filter, Search, Cog, Activity, Wind, Cpu, Wrench, Package } from 'lucide-react'
import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'
import AddToCartButton from '@/components/products/AddToCartButton'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Katalog Produk & Suku Cadang | CV. ADIE",
  description: "Jelajahi katalog lengkap suku cadang industri, pneumatic, automasi, mekanikal, dan peralatan pabrik dengan spesifikasi detail dari CV. ADIE.",
};

export const revalidate = 3600 // Regenerate cache every 1 hour (ISR)

// Helper function to get an icon based on category
const getCategoryIcon = (category: string) => {
  if (category.includes('Pneumatik')) return Wind;
  if (category.includes('Otomatisasi') || category.includes('Elektronik')) return Cpu;
  if (category.includes('Elektrikal')) return Activity;
  if (category.includes('Tekstil')) return Cog;
  if (category.includes('Perkakas')) return Wrench;
  return Package;
}

export default async function Products() {
  // Using standard server client as per architecture guidelines
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  // Fetch products from Supabase
  const { data: products, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false })

  // Fallback to empty array if no products found or error occurs
  const productList = products || []

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <section className="bg-brand-primary text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="font-serif text-3xl md:text-4xl font-bold mb-4">Katalog Produk</h1>
          <p className="text-gray-200">Eksplorasi komponen spesifik industri, otomasi, dan suku cadang pabrik.</p>
        </div>
      </section>

      <section className="py-12 flex-1">
        <div className="container mx-auto px-4 flex flex-col md:flex-row gap-8">
          {/* Sidebar Filter */}
          <aside className="w-full md:w-64 shrink-0">
            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm sticky top-28">
              <div className="flex items-center gap-2 mb-6 text-brand-primary font-bold text-lg border-b pb-4">
                <Filter className="w-5 h-5" /> Filter Produk
              </div>
              
              <div className="mb-6">
                <h3 className="font-bold text-gray-900 mb-3">Kategori Spesifik</h3>
                <ul className="space-y-3 text-sm text-gray-600">
                  {[
                    'Pneumatik & Kompresor', 
                    'Otomatisasi & Komponen Elektronik', 
                    'Perbaikan Elektrikal', 
                    'Suku Cadang Khusus Tekstil', 
                    'Perkakas & Produk Lain-lain'
                  ].map((cat, idx) => (
                    <li key={idx} className="flex items-center gap-2 cursor-pointer hover:text-brand-accent transition-colors">
                      <input type="checkbox" className="rounded text-brand-primary focus:ring-brand-primary w-4 h-4 cursor-pointer" />
                      {cat}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="font-bold text-gray-900 mb-3">Merek (Brands)</h3>
                <ul className="space-y-3 text-sm text-gray-600">
                  {['CKD', 'FESTO', 'SMC', 'RBCA', 'DeWALT', 'Pamy', 'Elite Air'].map((brand, idx) => (
                    <li key={idx} className="flex items-center gap-2 cursor-pointer hover:text-brand-accent transition-colors">
                      <input type="checkbox" className="rounded text-brand-primary focus:ring-brand-primary w-4 h-4 cursor-pointer" />
                      {brand}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </aside>

          {/* Product Grid */}
          <div className="flex-1">
            <div className="bg-white p-4 rounded-lg border border-gray-200 mb-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
              <div className="relative w-full max-w-md">
                <input 
                  type="text" 
                  placeholder="Cari part number atau tipe barang..." 
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:border-brand-primary focus:ring-brand-primary"
                />
                <Search className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
              </div>
              <div className="text-sm text-gray-500 font-medium shrink-0">
                Menampilkan {productList.length > 0 ? `1-${productList.length}` : '0'} dari {productList.length} Produk
              </div>
            </div>

            {error ? (
              <div className="p-8 text-center bg-red-50 text-red-600 rounded-lg border border-red-200">
                Gagal memuat produk. Silakan pastikan koneksi database Supabase Anda aktif.
              </div>
            ) : productList.length === 0 ? (
              <div className="p-8 text-center bg-white text-gray-500 rounded-lg border border-gray-200 shadow-sm">
                Belum ada produk yang ditambahkan. Silakan eksekusi skrip <code className="bg-gray-100 px-1 rounded">seed.sql</code> di Supabase.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {productList.map((prod: any, i: number) => {
                  const Icon = getCategoryIcon(prod.category)
                  
                  return (
                    <div key={prod.id || i} className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-all hover:-translate-y-1 flex flex-col group">
                      <div className="aspect-square bg-gray-50 flex items-center justify-center relative p-6 border-b border-gray-100">
                        {prod.image_url ? (
                          <>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={prod.image_url} alt={prod.name} className="object-contain w-full h-full mix-blend-multiply" />
                          </>
                        ) : (
                          <Icon className="w-24 h-24 text-gray-300 group-hover:text-brand-primary transition-colors" />
                        )}
                      </div>
                      <div className="p-5 flex flex-col flex-1">
                        <div className="flex justify-between items-start mb-2 gap-2">
                          <div className="text-xs font-bold text-brand-primary uppercase tracking-wider">{prod.brand}</div>
                          <div className="text-xs text-gray-400 font-medium text-right">
                            {prod.category}
                            {prod.sub_category && (
                              <span className="block text-[10px] text-gray-300 mt-0.5">{prod.sub_category}</span>
                            )}
                          </div>
                        </div>
                        <h3 className="font-bold text-gray-900 text-lg mb-2 line-clamp-2 leading-tight">{prod.name}</h3>
                        <p className="text-xs font-mono text-gray-500 mb-2">PN: {prod.part_number}</p>
                        <p className="text-sm text-gray-500 mb-6 flex-1 leading-relaxed line-clamp-3">{prod.description}</p>
                        <div className="flex items-center gap-2 mt-auto">
                          <button className="flex-1 text-center border-2 border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-white font-bold py-2.5 rounded transition-colors text-sm">
                            DETAIL
                          </button>
                          <AddToCartButton 
                            product={{
                              id: prod.id,
                              part_number: prod.part_number,
                              name: prod.name,
                              category: prod.category,
                              image_url: prod.image_url
                            }} 
                          />
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
            
            {/* Pagination */}
            {productList.length > 0 && (
              <div className="mt-12 flex justify-center gap-2">
                {[1].map((p, idx) => (
                  <button key={idx} className={`w-10 h-10 rounded flex items-center justify-center font-bold ${p === 1 ? 'bg-brand-primary text-white shadow-md' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
                    {p}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
