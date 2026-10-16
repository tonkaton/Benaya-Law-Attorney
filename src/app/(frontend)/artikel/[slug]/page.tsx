import { RichText } from '@payloadcms/richtext-lexical/react'
import { ArrowLeft, Calendar } from 'lucide-react'
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { getArticle, getArticleSlugs, mediaOf } from '@/lib/cms'
import { formatDate } from '@/lib/utils'

export const revalidate = 3600

type Props = { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  return (await getArticleSlugs()).map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const article = await getArticle((await params).slug)
  if (!article) return {}
  return {
    title: article.title,
    description: article.excerpt ?? undefined,
    openGraph: { type: 'article', title: article.title, description: article.excerpt ?? undefined, publishedTime: article.publishedAt },
  }
}

export default async function ArticlePage({ params }: Props) {
  const article = await getArticle((await params).slug)
  if (!article) notFound()
  const cover = mediaOf(article.cover)

  return (
    <div data-tl="paper" data-td="deep" className="bg-page pb-20 pt-28 text-fg">
      <article className="shell max-w-3xl">
        <Link href="/#artikel" className="inline-flex items-center gap-2 text-sm font-semibold text-brand hover:gap-3">
          <ArrowLeft className="h-4 w-4" /> Kembali ke artikel
        </Link>
        <div className="mt-6 flex items-center gap-3 text-sm">
          <span className="rounded-full bg-brand/10 px-3 py-0.5 font-semibold">{article.category}</span>
          <span className="flex items-center gap-1 text-fg-muted">
            <Calendar className="h-4 w-4" aria-hidden="true" />
            <time dateTime={article.publishedAt}>{formatDate(article.publishedAt)}</time>
          </span>
        </div>
        <h1 className="mt-4 text-3xl font-bold leading-tight tracking-[-0.03em] sm:text-5xl">{article.title}</h1>
        {article.excerpt && <p className="mt-4 text-lg leading-relaxed text-fg-muted">{article.excerpt}</p>}
        {cover?.url && (
          <Image src={cover.url} alt={cover.alt} width={cover.width ?? 1200} height={cover.height ?? 675} className="mt-8 w-full rounded-2xl object-cover" priority />
        )}
        {article.content && <RichText data={article.content} className="richtext mt-8" />}
      </article>
    </div>
  )
}
