import { About } from '@/components/sections/about'
import { Articles } from '@/components/sections/articles'
import { Contact } from '@/components/sections/contact'
import { Hero } from '@/components/sections/hero'
import { Services } from '@/components/sections/services'
import { Team } from '@/components/sections/team'
import { Testimonials } from '@/components/sections/testimonials'
import { getHomeData, getSiteSettings } from '@/lib/cms'

// Static page refreshed at most hourly; CMS saves revalidate it immediately (src/hooks/revalidate.ts).
export const revalidate = 3600

export default async function HomePage() {
  const [{ services, lawyers, testimonials, articles }, settings] = await Promise.all([getHomeData(), getSiteSettings()])

  // Structured data for local search results (Google business card for a law firm)
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LegalService',
    name: 'Benaya Law Attorney',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
    telephone: settings.phone,
    email: settings.email,
    address: { '@type': 'PostalAddress', streetAddress: settings.address, addressCountry: 'ID' },
    openingHours: settings.hours,
    areaServed: 'ID',
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Hero settings={settings} />
      <Services services={services} />
      <About stats={settings.stats ?? []} />
      <Team lawyers={lawyers} />
      <Testimonials testimonials={testimonials} />
      <Articles articles={articles} />
      <Contact settings={settings} />
    </>
  )
}
