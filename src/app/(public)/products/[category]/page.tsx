/* eslint-disable @typescript-eslint/no-explicit-any */
import { Filter, Search, Cog, Activity, Wind, Cpu, Wrench, Package, ArrowLeft } from 'lucide-react'
import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'
import AddToCartButton from '@/components/products/AddToCartButton'
import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { generateTitleFromSlug } from '@/utils/slugify'

export async function generateMetadata(
  props: { params: Promise<{ category: string }> }
): Promise<Metadata> {
  const params = await props.params;
  const categoryTitle = generateTitleFromSlug(params.category);
  return {
    title: `Produk ${categoryTitle} - CV. ADIE`,
    description: `Jelajahi katalog lengkap produk ${categoryTitle} dari CV. ADIE.`,
  }
}

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

export default async function CategoryPage(props: { params: Promise<{ category: string }>, searchParams: Promise<{ sub?: string }> }) {
  const params = await props.params;
  const searchParams = await props.searchParams;
  const slug = params.category;
  const categoryTitle = generateTitleFromSlug(slug);
  const selectedSub = searchParams.sub;

  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  // ✅ PERF: Single query — fetch all products for this category, then extract
  // unique sub-categories in memory. Avoids a second round-trip to the DB.
  let query = supabase
    .from('products')
    .select('id,name,part_number,brand,category,sub_category,description,image_url,created_at')
    .ilike('category', categoryTitle)
    .order('created_at', { ascending: false })
    .limit(48);

  if (selectedSub) {
    query = query.ilike('sub_category', selectedSub);
  }

  const { data: products, error } = await query;
  const productList = products || []

  // Derive unique sub-categories from the fetched data (zero extra DB calls)
  const uniqueSubCategories = selectedSub
    ? await (async () => {
        const { data } = await supabase
          .from('products')
          .select('sub_category')
          .ilike('category', categoryTitle);
        return Array.from(new Set((data || []).map(p => p.sub_category).filter(Boolean))) as string[];
      })()
    : Array.from(new Set(productList.map(p => p.sub_category).filter(Boolean))) as string[];

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <section className="bg-brand-primary text-white py-12">
        <div className="container mx-auto px-4">
          <Link href="/products" className="inline-flex items-center gap-2 text-brand-accent hover:text-white transition-colors mb-4 text-sm font-bold">
            <ArrowLeft className="w-4 h-4" /> KEMBALI KE SEMUA PRODUK
          </Link>
          <h1 className="font-serif text-3xl md:text-4xl font-bold mb-4">{categoryTitle}</h1>
          <p className="text-gray-200">Katalog spesifik untuk kebutuhan {categoryTitle} di pabrik Anda.</p>
        </div>
      </section>

      <section className="py-12 flex-1">
        <div className="container mx-auto px-4 flex flex-col md:flex-row gap-8">
          {/* Sidebar Filter */}
          <aside className="w-full md:w-64 shrink-0">
            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm sticky top-28">
              <div className="flex items-center gap-2 mb-6 text-brand-primary font-bold text-lg border-b pb-4">
                <Filter className="w-5 h-5" /> Filter Sub-Kategori
              </div>
              
              <div className="mb-6">
                <ul className="space-y-3 text-sm text-gray-600">
                  <li className="flex items-center gap-2">
                    <Link 
                      href={`/products/${slug}`} 
                      className={`flex-1 transition-colors ${!selectedSub ? 'text-brand-primary font-bold' : 'hover:text-brand-accent'}`}
                    >
                      Semua Produk {categoryTitle}
                    </Link>
                  </li>
                  {uniqueSubCategories.length > 0 ? (
                    uniqueSubCategories.map((sub, idx) => {
                      const isActive = selectedSub === sub;
                      return (
                        <li key={idx} className="flex items-center gap-2">
                          <Link 
                            href={`/products/${slug}?sub=${encodeURIComponent(sub)}`}
                            className={`flex-1 transition-colors ${isActive ? 'text-brand-primary font-bold' : 'hover:text-brand-accent'}`}
                          >
                            {sub}
                          </Link>
                        </li>
                      );
                    })
                  ) : (
                    <li className="text-gray-400 italic">Tidak ada sub-kategori tersedia</li>
                  )}
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
                  placeholder={`Cari di ${categoryTitle}...`}
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
                Tidak ada produk ditemukan di kategori/sub-kategori ini.
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
                            <Image src={prod.image_url} alt={prod.name} fill className="object-contain mix-blend-multiply" sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" />
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
            
          </div>
        </div>
      </section>
    </div>
  )
}
