import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/test-supabase/'],
    },
    sitemap: 'https://www.cv-adie.com/sitemap.xml',
  }
}
