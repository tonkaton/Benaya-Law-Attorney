import { postgresAdapter } from '@payloadcms/db-postgres'
import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
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

// Local dev: SQLite file (zero setup). Production: set DATABASE_URL=postgres://… — same schema (both Drizzle).
const DATABASE_URL = process.env.DATABASE_URL || 'file:./bla.db'

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
    ? postgresAdapter({ pool: { connectionString: DATABASE_URL } })
    : sqliteAdapter({ client: { url: DATABASE_URL } }),
  sharp,
  jobs: {
    tasks: [sendLeadEmail],
    // long-running server (next start / dev): process the queue every minute.
    // ponytail: in-process cron; on serverless hosting call /api/payload-jobs/run from a platform cron instead.
    autoRun: [{ cron: '* * * * *', queue: 'default', limit: 20 }],
  },
})
