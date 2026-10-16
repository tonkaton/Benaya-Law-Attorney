import { Star } from 'lucide-react'
import type { CSSProperties } from 'react'

import { SegSwitch } from '@/components/seg-switch'
import type { Testimonial } from '@/payload-types'

const SECONDS_PER_CARD = 8.4 // same scroll speed whatever the filter

function Card({ t, dup }: { t: Testimonial; dup?: boolean }) {
  const initials = t.clientName.split(/[\s.]+/).filter(Boolean).map((w) => w[0]).join('').slice(0, 2)
  return (
    <article
      data-aud={t.clientType}
      {...(dup && { 'aria-hidden': true, 'data-dup': '' })}
      className="glass ring-grad w-[320px] shrink-0 rounded-2xl p-5"
    >
      <div className="mb-3 flex items-center gap-3">
        <span className="grid h-11 w-11 place-items-center rounded-full bg-[#2A5FE6] text-sm font-bold text-white" aria-hidden="true">
          {initials}
        </span>
        <div>
          <p className="text-sm font-semibold">{t.clientName}</p>
          <p className="text-xs text-fg-muted">{t.clientRole}</p>
        </div>
      </div>
      <p className="text-sm leading-relaxed text-fg-muted">“{t.text}”</p>
      {t.rating ? (
        <div className="mt-3 flex gap-0.5 text-brand" role="img" aria-label={`Rating ${t.rating} dari 5`}>
          {Array.from({ length: t.rating }, (_, i) => (
            <Star key={i} className="h-4 w-4 fill-current" aria-hidden="true" />
          ))}
        </div>
      ) : null}
    </article>
  )
}

export function Testimonials({ testimonials }: { testimonials: Testimonial[] }) {
  if (!testimonials.length) return null
  const count = (type: string) => testimonials.filter((t) => t.clientType === type).length
  const vars = {
    '--dur-semua': `${testimonials.length * SECONDS_PER_CARD}s`,
    '--dur-korporat': `${count('korporat') * SECONDS_PER_CARD}s`,
    '--dur-individu': `${count('individu') * SECONDS_PER_CARD}s`,
  } as CSSProperties

  return (
    <section data-tl="cobalt" data-td="cobalt" className="relative overflow-hidden bg-page py-20 text-fg" aria-labelledby="testi-title">
      <div className="absolute left-1/4 top-10 h-[380px] w-[380px] rounded-full bg-brand/[0.07] blur-[130px]" aria-hidden="true" />
      <div className="shell relative mb-10 text-center">
        <p className="text-xs font-semibold tracking-[0.2em] text-brand">TESTIMONI KLIEN</p>
        <h2 id="testi-title" className="mt-3 text-3xl font-bold tracking-[-0.025em] sm:text-[2.6rem]">Apa Kata Klien Kami</h2>
        <SegSwitch
          className="mx-auto mt-6"
          target="testi"
          label="Saring testimoni berdasarkan jenis klien"
          options={[
            { value: 'semua', label: 'Semua' },
            { value: 'korporat', label: 'Korporat' },
            { value: 'individu', label: 'Individu' },
          ]}
        />
      </div>
      <div id="testi" data-filter="semua" className="marquee-wrap relative overflow-hidden">
        {/* second copy only feeds the seamless loop: hidden from screen readers and from the reduced-motion layout */}
        <div className="marquee px-5" style={vars}>
          {testimonials.map((t) => <Card key={t.id} t={t} />)}
          {testimonials.map((t) => <Card key={`dup-${t.id}`} t={t} dup />)}
        </div>
        <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-page to-transparent" aria-hidden="true" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-page to-transparent" aria-hidden="true" />
      </div>
      <p className="shell mt-6 text-center text-xs text-fg-muted">
        Contoh testimoni (placeholder) — ganti dengan umpan balik klien terverifikasi sebelum publikasi.
      </p>
    </section>
  )
}
