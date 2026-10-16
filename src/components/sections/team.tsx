import { ArrowRight } from 'lucide-react'
import Image from 'next/image'

import { mediaOf } from '@/lib/cms'
import type { Lawyer } from '@/payload-types'

const initials = (name: string) =>
  name
    .split(',')[0]
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)

export function Team({ lawyers }: { lawyers: Lawyer[] }) {
  return (
    <section id="tim" data-tl="ice" data-td="navy" className="bg-page py-20 text-fg">
      <div className="shell">
        <div className="reveal mb-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-semibold tracking-[0.2em] text-brand">TIM KAMI</p>
            <h2 className="mt-3 text-3xl font-bold leading-tight tracking-[-0.025em] sm:text-[2.6rem]">
              Pengacara Profesional
              <br className="hidden sm:block" /> dan Berpengalaman
            </h2>
            <p className="mt-4 max-w-xl leading-relaxed text-fg-muted">
              Tim kami terdiri dari para profesional hukum yang berpengalaman di berbagai bidang hukum, siap memberikan
              solusi terbaik untuk setiap permasalahan Anda.
            </p>
          </div>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {lawyers.map((m) => {
            const photo = mediaOf(m.photo)
            const src = photo?.sizes?.card?.url || photo?.url
            return (
              <article
                key={m.id}
                className="card-hover group overflow-hidden rounded-xl border border-line bg-surface hover:-translate-y-0.5 hover:shadow-[0_12px_40px_-12px_rgba(16,26,51,.16)]"
              >
                <div className="relative aspect-[4/5] overflow-hidden bg-page-alt">
                  {src ? (
                    <Image
                      src={src}
                      alt={photo?.alt || m.name}
                      fill
                      sizes="(min-width: 1280px) 25vw, (min-width: 640px) 50vw, 100vw"
                      className="object-cover transition duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <span className="grid h-full place-items-center text-5xl font-bold text-fg-muted">{initials(m.name)}</span>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="text-[15px] font-bold leading-tight tracking-[-0.01em]">{m.name}</h3>
                  <p className="mt-0.5 text-sm font-semibold text-brand">{m.position}</p>
                  <p className="text-xs text-fg-muted">{m.specialization}</p>
                  <a href="#kontak" className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-brand transition-all group-hover:gap-2.5">
                    Hubungi <ArrowRight className="h-4 w-4" />
                  </a>
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
