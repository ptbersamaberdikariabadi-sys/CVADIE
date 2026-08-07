import { MetadataRoute } from 'next'
import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'
import { generateSlug } from '@/utils/slugify'

const BASE_URL = 'https://www.abadidewana.com'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  // ── Static routes ────────────────────────────────────────────────────────
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE_URL,                  lastModified: new Date(), changeFrequency: 'weekly',  priority: 1.0 },
    { url: `${BASE_URL}/products`,    lastModified: new Date(), changeFrequency: 'daily',   priority: 0.9 },
    { url: `${BASE_URL}/rfq`,         lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/services`,    lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/about`,       lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
  ]

  // ── Fetch all products from Supabase ────────────────────────────────────
  const { data: products } = await supabase
    .from('products')
    .select('id, category, updated_at, created_at')
    .order('created_at', { ascending: false })

  const productList = products || []

  // ── Category pages (unique per category) ────────────────────────────────
  const uniqueCategories = Array.from(
    new Set(productList.map((p) => p.category).filter(Boolean))
  ) as string[]

  const categoryRoutes: MetadataRoute.Sitemap = uniqueCategories.map((cat) => ({
    url: `${BASE_URL}/products/${generateSlug(cat)}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  }))

  // ── Individual product pages ─────────────────────────────────────────────
  // Each product gets its own URL so Google can index part numbers
  const productRoutes: MetadataRoute.Sitemap = productList.map((prod) => ({
    url: `${BASE_URL}/products/${generateSlug(prod.category)}/${prod.id}`,
    lastModified: prod.updated_at ? new Date(prod.updated_at) : new Date(prod.created_at),
    changeFrequency: 'weekly',
    priority: 0.7,
  }))

  return [...staticRoutes, ...categoryRoutes, ...productRoutes]
}
