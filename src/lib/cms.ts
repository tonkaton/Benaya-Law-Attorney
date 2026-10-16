import config from '@payload-config'
import { getPayload } from 'payload'

import type { Article, Lawyer, Media, PracticeArea, SiteSetting, Testimonial } from '@/payload-types'

export const getCms = () => getPayload({ config })

// overrideAccess: false → the Local API applies the *public* access rules
// (published articles only, approved + consented testimonials only).
const PUBLIC = { overrideAccess: false } as const

// Shown until the firm fills Site Settings in /admin, so a fresh install never renders broken links.
const FALLBACK_SETTINGS = {
  phone: '+62 21 1234 5678',
  whatsapp: '+62 812 3456 7890',
  email: 'info@benaya-law.com',
  address: 'Jl. Sudirman No. 88, Jakarta Selatan 12190',
  hours: 'Senin–Jumat, 09.00–17.00',
}

export async function getSiteSettings(): Promise<SiteSetting> {
  const cms = await getCms()
  const s = await cms.findGlobal({ slug: 'site-settings', ...PUBLIC })
  return { ...s, ...Object.fromEntries(Object.entries(FALLBACK_SETTINGS).filter(([k]) => !s[k as keyof SiteSetting])) }
}

export async function getHomeData() {
  const cms = await getCms()
  const [services, lawyers, testimonials, articles] = await Promise.all([
    cms.find({ collection: 'practice-areas', sort: 'order', limit: 50, ...PUBLIC }),
    cms.find({ collection: 'lawyers', sort: 'order', limit: 12, depth: 1, ...PUBLIC }),
    cms.find({ collection: 'testimonials', limit: 30, ...PUBLIC }),
    cms.find({ collection: 'articles', sort: '-publishedAt', limit: 30, depth: 1, ...PUBLIC }),
  ])
  return {
    services: services.docs as PracticeArea[],
    lawyers: lawyers.docs as Lawyer[],
    testimonials: testimonials.docs as Testimonial[],
    articles: articles.docs as Article[],
  }
}

export async function getArticle(slug: string): Promise<Article | null> {
  const cms = await getCms()
  const res = await cms.find({ collection: 'articles', where: { slug: { equals: slug } }, limit: 1, depth: 1, ...PUBLIC })
  return (res.docs[0] as Article) ?? null
}

export async function getArticleSlugs(): Promise<string[]> {
  const cms = await getCms()
  const res = await cms.find({ collection: 'articles', limit: 500, select: { slug: true }, ...PUBLIC })
  return res.docs.map((d) => d.slug).filter((s): s is string => !!s)
}

/** Upload fields come back as an id (depth 0) or a Media doc (depth ≥ 1). */
export const mediaOf = (v: number | Media | null | undefined): Media | null => (v && typeof v === 'object' ? v : null)
