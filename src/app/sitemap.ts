import type { MetadataRoute } from 'next'

import { getArticleSlugs } from '@/lib/cms'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const slugs = await getArticleSlugs()
  return [
    { url: SITE_URL, changeFrequency: 'weekly', priority: 1 },
    ...slugs.map((slug) => ({ url: `${SITE_URL}/artikel/${slug}`, changeFrequency: 'monthly' as const, priority: 0.7 })),
  ]
}
