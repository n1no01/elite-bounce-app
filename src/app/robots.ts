import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://elitebounce.fit'

  return {
    rules: {
      userAgent: '*',
      allow: ['/', '/ebook', '/register', '/login'],
      disallow: [
        '/admin/',   // Blokira sav admin panel i rute
        '/portal/',  // Blokira privatne portale sportista
        '/api/',     // Blokira backend API rute
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}