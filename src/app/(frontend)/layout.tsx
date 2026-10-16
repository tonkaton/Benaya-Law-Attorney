import type { Metadata, Viewport } from 'next'
import type { ReactNode } from 'react'

import { Footer, WhatsAppButton } from '@/components/footer'
import { Navbar } from '@/components/navbar'
import { getSiteSettings } from '@/lib/cms'
import './globals.css'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
const DESCRIPTION =
  'Benaya Law Attorney — firma hukum profesional di Indonesia. Layanan korporasi, litigasi, ketenagakerjaan, properti, perdata, dan pidana. Konsultasi gratis, respons 24 jam.'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: 'Benaya Law Attorney — Solusi Hukum Profesional & Terpercaya', template: '%s — Benaya Law Attorney' },
  description: DESCRIPTION,
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    siteName: 'Benaya Law Attorney',
    title: 'Benaya Law Attorney — Legal Solutions for a Stronger Tomorrow',
    description: DESCRIPTION,
  },
}

export const viewport: Viewport = { themeColor: '#F2F5FA' }

// Runs before first paint: saved choice → device preference. Prevents a light/dark flash.
const THEME_SCRIPT = `(function(){var t;try{t=localStorage.getItem("theme")}catch(e){}
if(t!=="light"&&t!=="dark")t=matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light";
document.documentElement.dataset.theme=t;if(t==="dark"){var m=document.querySelector('meta[name="theme-color"]');if(m)m.content="#0B1A33"}})()`

export default async function RootLayout({ children }: { children: ReactNode }) {
  const settings = await getSiteSettings()
  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
      </head>
      <body className="bg-page font-sans text-fg antialiased selection:bg-accent/40">
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-lg focus:bg-cta focus:px-4 focus:py-2 focus:text-on-cta">
          Langsung ke konten
        </a>
        <Navbar phone={settings.phone} />
        <main id="main">{children}</main>
        <Footer />
        <WhatsAppButton number={settings.whatsapp} />
      </body>
    </html>
  )
}
