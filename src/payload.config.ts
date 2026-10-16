import { postgresAdapter } from '@payloadcms/db-postgres'
import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'
import { id } from '@payloadcms/translations/languages/id'
import path from 'path'
import { buildConfig } from 'payload'
import sharp from 'sharp'
import { fileURLToPath } from 'url'

import { Articles, ConsultationRequests, Lawyers, PracticeAreas, Testimonials } from './collections/content'
import { Media } from './collections/Media'
import { Users } from './collections/Users'
import { SiteSettings } from './globals/SiteSettings'
import { sendLeadEmail } from './jobs/sendLeadEmail'

const dirname = path.dirname(fileURLToPath(import.meta.url))

// Local dev: SQLite file (zero setup). Production (Vercel): DATABASE_URL=postgres://… from the Neon integration.
// Both adapters are Drizzle-based, so the schema is identical; Postgres changes ship as migrations (src/migrations).
const DATABASE_URL = process.env.DATABASE_URL || 'file:./bla.db'
// Vercel functions have no persistent disk and no long-lived process.
const SERVERLESS = !!process.env.VERCEL

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: { baseDir: path.resolve(dirname) },
    meta: { titleSuffix: ' — Benaya CMS' },
  },
  // Indonesian dashboard for the firm's staff (English would otherwise win for English-language browsers)
  i18n: { supportedLanguages: { id }, fallbackLanguage: 'id' },
  collections: [PracticeAreas, Lawyers, Testimonials, Articles, ConsultationRequests, Media, Users],
  globals: [SiteSettings],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: { outputFile: path.resolve(dirname, 'payload-types.ts') },
  db: DATABASE_URL.startsWith('postgres')
    ? postgresAdapter({ pool: { connectionString: DATABASE_URL }, migrationDir: path.resolve(dirname, 'migrations') })
    : sqliteAdapter({ client: { url: DATABASE_URL } }),
  sharp,
  plugins: [
    // uploads go to Vercel Blob when its token is present (Vercel); local disk otherwise
    vercelBlobStorage({
      enabled: !!process.env.BLOB_READ_WRITE_TOKEN,
      collections: { media: true },
      token: process.env.BLOB_READ_WRITE_TOKEN,
    }),
  ],
  jobs: {
    tasks: [sendLeadEmail],
    // Server Actions run the lead job right after queueing it (see actions.ts). The scheduled run below
    // only sweeps retries: an in-process cron on a long-running server, or Vercel Cron → /api/payload-jobs/run.
    autoRun: [{ cron: '* * * * *', queue: 'default', limit: 20 }],
    shouldAutoRun: () => !SERVERLESS,
    access: {
      // Vercel Cron sends "Authorization: Bearer $CRON_SECRET"; logged-in staff may also trigger a run.
      run: ({ req }) =>
        !!req.user ||
        (!!process.env.CRON_SECRET && req.headers.get('authorization') === `Bearer ${process.env.CRON_SECRET}`),
    },
  },
})
