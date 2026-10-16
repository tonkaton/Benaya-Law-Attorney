import { Clock, Mail, MapPin, Phone } from 'lucide-react'

import { ConsultationForm } from '@/components/consultation-form'
import { MapFacade } from '@/components/map-facade'
import { SocialLinks } from '@/components/social-icons'
import type { SiteSetting } from '@/payload-types'
import { telHref } from '@/lib/utils'

export function Contact({ settings }: { settings: SiteSetting }) {
  const info = [
    { icon: MapPin, content: settings.address },
    { icon: Phone, content: settings.phone, href: telHref(settings.phone) },
    { icon: Mail, content: settings.email, href: `mailto:${settings.email}` },
    { icon: Clock, content: settings.hours },
  ]
  return (
    <section id="kontak" data-tl="sky" data-td="navy" className="relative overflow-hidden bg-page py-20 text-fg">
      <div className="absolute left-0 top-0 h-[420px] w-[420px] rounded-full bg-brand/[0.07] blur-[130px]" aria-hidden="true" />
      <div className="shell relative grid gap-8 lg:grid-cols-[1fr_1.2fr_1fr]">
        <div className="reveal">
          <p className="text-xs font-semibold tracking-[0.2em] text-brand">KONTAK KAMI</p>
          <h2 className="mt-3 text-3xl font-bold leading-tight tracking-[-0.025em] sm:text-[2.4rem]">Konsultasi Hukum Sekarang</h2>
          <p className="mt-4 leading-relaxed text-fg-muted">
            Tim kami siap membantu Anda. Silakan hubungi kami melalui informasi berikut atau isi form di samping.
          </p>
          <ul className="mt-6 space-y-4 text-sm">
            {info.map(({ icon: Icon, content, href }) => (
              <li key={content} className="flex gap-3">
                <Icon className="h-5 w-5 shrink-0 text-brand" aria-hidden="true" />
                {href ? <a href={href} className="transition hover:text-brand">{content}</a> : <span>{content}</span>}
              </li>
            ))}
          </ul>
          <div className="mt-6">
            <SocialLinks social={settings.social} />
          </div>
        </div>

        <div className="reveal glass ring-grad rounded-2xl p-6 sm:p-7">
          <h3 className="mb-5 text-xl font-bold tracking-[-0.01em]">Kirim Permintaan Konsultasi</h3>
          <ConsultationForm />
        </div>

        <div className="reveal">
          <MapFacade address={settings.address} />
        </div>
      </div>
    </section>
  )
}
