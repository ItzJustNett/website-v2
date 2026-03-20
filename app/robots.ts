import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://api.xoperr.dev'

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/auth/', '/setup/'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
