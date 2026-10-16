import { ArrowRight, Calendar } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

import { SegSwitch } from '@/components/seg-switch'
import { mediaOf } from '@/lib/cms'
import { formatDate } from '@/lib/utils'
import type { Article } from '@/payload-types'

const LISTS = [
  { value: 'semua', label: 'Semua' },
  { value: 'perusahaan', label: 'Perusahaan' },
  { value: 'individu', label: 'Individu' },
] as const

export function ArticleCard({ a }: { a: Article }) {
  const cover = mediaOf(a.cover)
  return (
    <article className="card-hover group overflow-hidden rounded-xl border border-line bg-surface hover:-translate-y-0.5 hover:shadow-[0_12px_40px_-12px_rgba(16,26,51,.16)]">
      <div className="relative aspect-[16/9] overflow-hidden bg-gradient-to-br from-[#0B1A33] to-[#2A5FE6]">
        {cover?.url ? (
          <Image src={cover.url} alt={cover.alt} fill sizes="(min-width: 768px) 33vw, 100vw" className="object-cover transition duration-500 group-hover:scale-105" />
        ) : (
          <span className="grid h-full place-items-center text-lg font-bold text-[#8DBBFF]" aria-hidden="true">
            {a.category}
          </span>
        )}
      </div>
      <div className="p-5">
        <div className="mb-2 flex items-center gap-3 text-xs">
          <span className="rounded-full bg-brand/10 px-2.5 py-0.5 font-semibold">{a.category}</span>
          <span className="flex items-center gap-1 text-fg-muted">
            <Calendar className="h-3.5 w-3.5" aria-hidden="true" />
            <time dateTime={a.publishedAt}>{formatDate(a.publishedAt)}</time>
          </span>
        </div>
        <h3 className="text-[16px] font-bold leading-snug tracking-[-0.01em]">{a.title}</h3>
        <Link href={`/artikel/${a.slug}`} className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand transition-all group-hover:gap-2.5">
          Baca Selengkapnya <ArrowRight className="h-4 w-4" />
          <span className="sr-only">: {a.title}</span>
        </Link>
      </div>
    </article>
  )
}

export function Articles({ articles }: { articles: Article[] }) {
  return (
    <section id="artikel" data-tl="paper" data-td="deep" className="bg-page py-20 text-fg">
      <div className="shell">
        <div className="reveal mb-10">
          <p className="text-xs font-semibold tracking-[0.2em] text-brand">ARTIKEL &amp; WAWASAN</p>
          <h2 className="mt-3 text-3xl font-bold tracking-[-0.025em] sm:text-[2.6rem]">Insight Hukum Terbaru</h2>
          <p className="mt-4 max-w-xl leading-relaxed text-fg-muted">
            Dapatkan informasi dan pembahasan seputar hukum, bisnis, dan regulasi dari para ahli kami.
          </p>
          <SegSwitch className="mt-6" target="article-list" label="Saring artikel berdasarkan jenis klien" options={[...LISTS]} />
        </div>
        {/* one pre-rendered list per filter: always "the 3 latest" for that audience */}
        <div id="article-list" data-filter="semua">
          {LISTS.map(({ value }) => (
            <div key={value} data-list={value} className="grid gap-6 md:grid-cols-3">
              {articles
                .filter((a) => value === 'semua' || a.audience === value)
                .slice(0, 3)
                .map((a) => (
                  <ArticleCard key={a.id} a={a} />
                ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
