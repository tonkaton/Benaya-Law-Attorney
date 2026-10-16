import { ArrowRight } from 'lucide-react'

import { cmsIcon } from '@/components/icons'
import { SegSwitch } from '@/components/seg-switch'
import type { PracticeArea } from '@/payload-types'

export function Services({ services }: { services: PracticeArea[] }) {
  return (
    <section id="layanan" data-tl="paper" data-td="deep" className="bg-page py-20 text-fg">
      <div className="shell grid items-start gap-10 lg:grid-cols-[320px_1fr] lg:gap-14">
        <div className="reveal">
          <p className="text-xs font-semibold tracking-[0.2em] text-brand">PRACTICE AREAS</p>
          <h2 className="mt-3 text-3xl font-bold leading-tight tracking-[-0.025em] sm:text-[2.6rem]">Layanan Hukum Kami</h2>
          <p className="mt-4 leading-relaxed text-fg-muted">
            Kami menyediakan layanan hukum yang komprehensif dan disesuaikan dengan kebutuhan Anda, baik untuk individu
            maupun perusahaan.
          </p>
          <SegSwitch
            className="mt-6"
            target="service-list"
            label="Saring layanan berdasarkan jenis klien"
            options={[
              { value: 'semua', label: 'Semua' },
              { value: 'perusahaan', label: 'Perusahaan' },
              { value: 'individu', label: 'Individu' },
            ]}
          />
          <a href="#kontak" className="mt-6 inline-flex items-center gap-2 font-semibold text-brand transition-all hover:gap-3">
            Konsultasikan Kebutuhan Anda <ArrowRight className="h-4 w-4" />
          </a>
        </div>

        <div id="service-list" data-filter="semua" className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {services.map((s) => {
            const Icon = cmsIcon(s.icon)
            return (
              <article
                key={s.id}
                data-aud={(s.audiences ?? []).join(' ')}
                className="card-hover group rounded-xl border border-line bg-surface p-5 hover:-translate-y-0.5 hover:border-brand/40 hover:shadow-[0_12px_40px_-12px_rgba(16,26,51,.16)]"
              >
                <div className="mb-4 grid h-11 w-11 place-items-center rounded-lg bg-brand/10 text-brand">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </div>
                <h3 className="text-[17px] font-bold leading-snug tracking-[-0.01em]">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-fg-muted">{s.description}</p>
                <a href="#kontak" className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand transition-all group-hover:gap-2.5">
                  Konsultasikan <ArrowRight className="h-4 w-4" />
                </a>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
