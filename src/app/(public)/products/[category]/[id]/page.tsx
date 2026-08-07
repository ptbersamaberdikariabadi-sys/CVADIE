/* eslint-disable @typescript-eslint/no-explicit-any */
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, Tag, Package, MessageCircle, ShoppingCart } from 'lucide-react'
import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'
import { generateTitleFromSlug } from '@/utils/slugify'
import AddToCartButton from '@/components/products/AddToCartButton'

export const revalidate = 3600

interface Props {
  params: Promise<{ category: string; id: string }>
}

// ── Dynamic Metadata (diindex Google per produk) ──────────────────────────────
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  const { data: product } = await supabase
    .from('products')
    .select('name, part_number, brand, category, description, image_url')
    .eq('id', id)
    .single()

  if (!product) {
    return { title: 'Produk Tidak Ditemukan' }
  }

  const title = `${product.name} (${product.part_number}) - CV. ADIE`
  const description = `Beli ${product.name} dari ${product.brand} — Part Number: ${product.part_number}. ${product.description || ''} Tersedia di CV. Abadi Dewana Industrial Equipment, distributor suku cadang industri terpercaya di Indonesia.`

  return {
    title,
    description,
    keywords: [
      product.part_number,
      product.name,
      product.brand,
      product.category,
      `beli ${product.name}`,
      `harga ${product.part_number}`,
      `distributor ${product.brand} Indonesia`,
      `suku cadang ${product.category}`,
      'CV ADIE',
      'CV Abadi Dewana',
    ].filter(Boolean),
    openGraph: {
      title,
      description,
      images: product.image_url ? [{ url: product.image_url }] : [{ url: 'https://www.abadidewana.com/logo.jpeg' }],
      type: 'website',
    },
    alternates: {
      canonical: `/products/${await (await params).category}/${id}`,
    },
  }
}

// ── Page Component ────────────────────────────────────────────────────────────
export default async function ProductDetailPage({ params }: Props) {
  const { category, id } = await params
  const categoryTitle = generateTitleFromSlug(category)

  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  const { data: product } = await supabase
    .from('products')
    .select('id, name, part_number, brand, category, sub_category, description, image_url')
    .eq('id', id)
    .single()

  if (!product) notFound()

  // ── JSON-LD Product Schema (kode material terindex Google) ──────────────────
  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    sku: product.part_number,
    mpn: product.part_number,
    image: product.image_url || 'https://www.abadidewana.com/logo.jpeg',
    brand: {
      '@type': 'Brand',
      name: product.brand,
    },
    category: product.category,
    offers: {
      '@type': 'Offer',
      url: `https://www.abadidewana.com/products/${category}/${id}`,
      priceCurrency: 'IDR',
      availability: 'https://schema.org/InStock',
      seller: {
        '@type': 'Organization',
        name: 'CV. Abadi Dewana Industrial Equipment',
      },
    },
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />

      {/* Breadcrumb */}
      <section className="bg-brand-primary text-white py-10">
        <div className="container mx-auto px-4">
          <nav className="flex items-center gap-2 text-sm text-gray-300 mb-4" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-white transition-colors">Beranda</Link>
            <span>/</span>
            <Link href="/products" className="hover:text-white transition-colors">Produk</Link>
            <span>/</span>
            <Link href={`/products/${category}`} className="hover:text-white transition-colors">{categoryTitle}</Link>
            <span>/</span>
            <span className="text-white font-medium truncate max-w-xs">{product.name}</span>
          </nav>
          <Link
            href={`/products/${category}`}
            className="inline-flex items-center gap-2 text-brand-accent hover:text-white transition-colors font-bold text-sm"
          >
            <ArrowLeft className="w-4 h-4" /> Kembali ke {categoryTitle}
          </Link>
        </div>
      </section>

      {/* Product Detail */}
      <section className="py-12 flex-1">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="flex flex-col md:flex-row">

              {/* Gambar Produk */}
              <div className="md:w-2/5 bg-gray-50 flex items-center justify-center p-10 border-b md:border-b-0 md:border-r border-gray-100">
                {product.image_url ? (
                  <div className="relative w-full aspect-square max-w-xs">
                    <Image
                      src={product.image_url}
                      alt={`${product.name} — Part Number ${product.part_number} dari ${product.brand}`}
                      fill
                      className="object-contain mix-blend-multiply"
                      sizes="(max-width: 768px) 100vw, 40vw"
                      priority
                    />
                  </div>
                ) : (
                  <Package className="w-32 h-32 text-gray-200" />
                )}
              </div>

              {/* Info Produk */}
              <div className="md:w-3/5 p-8 flex flex-col">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs font-bold text-brand-primary uppercase tracking-wider bg-brand-primary/10 px-3 py-1 rounded-full">
                    {product.brand}
                  </span>
                  <span className="text-xs text-gray-400">{product.category}</span>
                  {product.sub_category && (
                    <span className="text-xs text-gray-400">/ {product.sub_category}</span>
                  )}
                </div>

                <h1 className="font-serif text-2xl md:text-3xl font-bold text-gray-900 mb-3 leading-tight">
                  {product.name}
                </h1>

                {/* Part Number — sangat penting untuk SEO kode material */}
                <div className="flex items-center gap-2 mb-5 p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <Tag className="w-4 h-4 text-brand-primary shrink-0" />
                  <div>
                    <span className="text-xs text-gray-500 font-medium block">Part Number / Kode Material</span>
                    <span className="font-mono font-bold text-gray-900 text-lg tracking-wider">{product.part_number}</span>
                  </div>
                </div>

                {product.description && (
                  <p className="text-gray-600 leading-relaxed mb-6 flex-1">
                    {product.description}
                  </p>
                )}

                <div className="border-t border-gray-100 pt-6 space-y-3">
                  <p className="text-sm text-gray-500">
                    Harga tersedia melalui penawaran. Hubungi tim kami untuk mendapatkan harga terbaik dan ketersediaan stok.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <AddToCartButton
                      product={{
                        id: product.id,
                        part_number: product.part_number,
                        name: product.name,
                        category: product.category,
                        image_url: product.image_url,
                      }}
                    />
                    <Link
                      href={`https://wa.me/6281214614097?text=${encodeURIComponent(`Halo CV. ADIE, saya ingin menanyakan harga dan ketersediaan:\n\nProduk: ${product.name}\nPart Number: ${product.part_number}\nBrand: ${product.brand}`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold py-3 rounded-lg transition-colors"
                    >
                      <MessageCircle className="w-5 h-5" />
                      Tanya Harga via WA
                    </Link>
                  </div>
                  <Link
                    href="/rfq"
                    className="w-full flex items-center justify-center gap-2 border-2 border-brand-accent text-brand-accent hover:bg-brand-accent hover:text-white font-bold py-3 rounded-lg transition-colors text-sm"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    Tambahkan ke Keranjang RFQ
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Info Box */}
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
            {[
              { label: 'Garansi', value: 'Penggantian 100% identik jika bermasalah' },
              { label: 'Pembayaran', value: 'Term of Payment fleksibel (B2B)' },
              { label: 'Pengiriman', value: 'Seluruh Indonesia via jaringan logistik' },
            ].map((item) => (
              <div key={item.label} className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="font-bold text-brand-primary text-xs uppercase tracking-wider mb-1">{item.label}</div>
                <div className="text-gray-600">{item.value}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
