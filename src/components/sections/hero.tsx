import { ArrowRight, Gavel, Mail, MessageCircle, Phone } from 'lucide-react'
import Image from 'next/image'

import { SocialLinks } from '@/components/social-icons'
import { buttonVariants } from '@/components/ui/button'
import type { SiteSetting } from '@/payload-types'
import { telHref, waHref } from '@/lib/utils'

// placeholder photography, self-hosted in /public/images (no runtime dependency on a third-party CDN)
const TRUST_FACES = ['/images/face-1.jpg', '/images/face-2.jpg', '/images/face-3.jpg', '/images/face-4.jpg']

export function Hero({ settings }: { settings: SiteSetting }) {
  const contacts = [
    { href: telHref(settings.phone), icon: Phone, title: settings.phone, sub: settings.hours },
    { href: waHref(settings.whatsapp), icon: MessageCircle, title: settings.whatsapp, sub: 'Chat via WhatsApp', external: true },
    { href: `mailto:${settings.email}`, icon: Mail, title: settings.email, sub: 'Email resmi kami' },
  ]
  return (
    <section id="top" data-tl="sky" data-td="navy" className="relative overflow-hidden bg-page pt-16 text-fg">
      <div className="absolute -left-32 -top-32 h-[480px] w-[480px] rounded-full bg-brand/10 blur-[120px]" aria-hidden="true" />
      <div className="absolute right-0 top-20 h-[520px] w-[520px] rounded-full bg-accent/20 blur-[130px]" aria-hidden="true" />

      <div className="shell relative grid items-center gap-12 py-16 lg:grid-cols-2 lg:py-24">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-brand/30 bg-brand/5 px-3 py-1 text-xs font-semibold tracking-wider">
            <Gavel className="h-3.5 w-3.5 text-brand" aria-hidden="true" /> LAW FIRM
          </span>
          <h1 className="mt-5 text-[2.6rem] font-bold leading-[1.02] tracking-[-0.035em] sm:text-[3.4rem] lg:text-[4rem]">
            Legal Solutions
            <br className="hidden sm:block" /> for a Stronger
            <br className="hidden sm:block" /> <span className="hl">Tomorrow.</span>
          </h1>
          <p className="mt-5 max-w-lg leading-relaxed text-fg-muted">
            Kami hadir untuk memberikan layanan hukum yang profesional, strategis, dan berorientasi pada hasil. Dengan
            pengalaman dan komitmen tinggi, kami siap mendampingi Anda dalam setiap langkah hukum yang Anda hadapi.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <a href="#kontak" className={buttonVariants({ size: 'lg' })}>
              Konsultasi Sekarang <ArrowRight className="h-4 w-4" />
            </a>
            <a href="#layanan" className={buttonVariants({ variant: 'outline', size: 'lg' })}>
              Jelajahi Layanan Kami
            </a>
          </div>
          <div className="mt-9 flex items-center gap-4">
            <div className="flex -space-x-3">
              {TRUST_FACES.map((src) => (
                <Image
                  key={src}
                  src={src}
                  alt=""
                  width={40}
                  height={40}
                  className="h-10 w-10 rounded-full border-2 border-page object-cover"
                />
              ))}
            </div>
            <div className="text-sm">
              <p className="font-semibold">Dipercaya oleh 1.000+ klien</p>
              <p className="text-fg-muted">Dari startup, hingga perusahaan besar</p>
            </div>
          </div>
        </div>

        <div className="relative">
          <div className="ring-grad relative overflow-hidden rounded-2xl border border-line">
            <Image
              src="/images/hero.jpg"
              alt="Tim pengacara profesional Benaya Law Attorney"
              width={900}
              height={840}
              priority
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="h-[360px] w-full object-cover object-top sm:h-[420px]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0B1A33]/40 to-transparent" aria-hidden="true" />
          </div>

          <div className="glass ring-grad mt-4 rounded-2xl p-5 shadow-2xl lg:absolute lg:-bottom-8 lg:-right-4 lg:mt-0 lg:w-[290px]">
            <p className="mb-3 text-xs font-semibold tracking-wider text-brand">HUBUNGI KAMI</p>
            {contacts.map(({ href, icon: Icon, title, sub, external }) => (
              <a key={href} href={href} {...(external && { target: '_blank', rel: 'noopener' })} className="group flex items-start gap-3 py-2">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-brand/10 text-brand">
                  <Icon className="h-4 w-4" aria-hidden="true" />
                </span>
                <span>
                  <span className="block text-sm font-semibold transition group-hover:text-brand">{title}</span>
                  <span className="block text-xs text-fg-muted">{sub}</span>
                </span>
              </a>
            ))}
            <div className="mt-3 border-t border-line pt-3">
              <SocialLinks social={settings.social} />
            </div>
            <p className="mt-3 text-[11px] text-fg-muted">Konsultasi cepat, respons dalam 24 jam.</p>
          </div>
        </div>
      </div>
    </section>
  )
}
