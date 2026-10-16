import { ArrowRight, CircleCheck } from 'lucide-react'
import Image from 'next/image'

import { cmsIcon } from '@/components/icons'
import { SegSwitch } from '@/components/seg-switch'
import { buttonVariants } from '@/components/ui/button'
import type { SiteSetting } from '@/payload-types'

const AUDIENCE_COPY = {
  perusahaan: {
    text: 'Bagi perusahaan, kami adalah mitra hukum strategis: dari pendirian badan usaha, kontrak, dan kepatuhan, hingga penyelesaian sengketa komersial. Kami memahami bahwa keputusan hukum adalah keputusan bisnis.',
    points: ['Pendirian badan usaha & perizinan', 'Kontrak, merger & akuisisi', 'Kepatuhan & sengketa ketenagakerjaan'],
  },
  individu: {
    text: 'Bagi Anda secara pribadi, kami mendampingi dengan bahasa yang mudah dipahami dan proses yang transparan, dari sengketa properti dan urusan keluarga hingga perkara pidana.',
    points: ['Sengketa tanah & properti', 'Perceraian, waris & hak asuh anak', 'Pendampingan perkara pidana'],
  },
} as const

export function About({ stats }: { stats: NonNullable<SiteSetting['stats']> }) {
  return (
    <section id="tentang" data-tl="navy" data-td="cobaltdeep" className="relative overflow-hidden bg-page py-20 text-fg">
      <div className="absolute bottom-0 right-0 h-[460px] w-[460px] rounded-full bg-brand/10 blur-[130px]" aria-hidden="true" />
      <div className="shell relative grid items-center gap-10 lg:grid-cols-3">
        <div className="reveal relative">
          <div className="overflow-hidden rounded-2xl border border-line">
            <Image
              src="/images/office.jpg"
              alt="Ruang kantor Benaya Law Attorney"
              width={600}
              height={640}
              sizes="(min-width: 1024px) 33vw, 100vw"
              className="h-[320px] w-full object-cover"
            />
          </div>
          <blockquote className="glass ring-grad relative -mt-10 ml-4 mr-8 rounded-xl p-5">
            <p className="text-xl font-bold leading-snug tracking-[-0.01em]">
              “Hukum bukan hanya tentang aturan, tetapi tentang keadilan.”
            </p>
          </blockquote>
        </div>

        <div className="reveal">
          <p className="text-xs font-semibold tracking-[0.2em] text-brand">TENTANG KAMI</p>
          <h2 className="mt-3 text-3xl font-bold leading-tight tracking-[-0.025em] sm:text-[2.6rem]">Mitra Strategis untuk Masa Depan Anda</h2>
          <SegSwitch
            tabs
            className="mt-6"
            target="audience"
            label="Pilih jenis klien"
            options={[
              { value: 'perusahaan', label: 'Untuk Perusahaan', icon: 'building' },
              { value: 'individu', label: 'Untuk Individu', icon: 'user' },
            ]}
          />
          <div id="audience" data-filter="perusahaan" className="mt-5">
            {(Object.keys(AUDIENCE_COPY) as (keyof typeof AUDIENCE_COPY)[]).map((key) => (
              <div key={key} id={`audience-${key}`} role="tabpanel" aria-labelledby={`audience-tab-${key}`} data-list={key}>
                <p className="leading-relaxed text-fg-muted">{AUDIENCE_COPY[key].text}</p>
                <ul className="mt-4 space-y-2 text-sm">
                  {AUDIENCE_COPY[key].points.map((p) => (
                    <li key={p} className="flex gap-2.5">
                      <CircleCheck className="h-5 w-5 shrink-0 text-brand" aria-hidden="true" />
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <a href="#tim" className={buttonVariants({ size: 'lg', className: 'mt-7' })}>
            Kenali Tim Kami <ArrowRight className="h-4 w-4" />
          </a>
        </div>

        <div className="reveal grid gap-6">
          {stats.map((s) => {
            const Icon = cmsIcon(s.icon)
            return (
              <div key={s.id ?? s.label} className="flex items-center gap-4">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-brand/10 text-brand">
                  <Icon className="h-6 w-6" aria-hidden="true" />
                </span>
                <div>
                  <p className="mb-1 text-3xl font-bold leading-none tracking-[-0.03em]">{s.value}</p>
                  <p className="text-sm text-fg-muted">{s.label}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
