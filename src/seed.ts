/**
 * Seeds the CMS with the prototype's placeholder content.  Run: `pnpm seed`
 * Idempotent: creates the admin only when there are no users, and content only when collections are empty.
 * Everything here is PLACEHOLDER — replace names, credentials, testimonials and articles with verified data (PRD FR-05/06).
 */
import { getPayload } from 'payload'

import config from './payload.config'

const payload = await getPayload({ config })
const req = { context: { disableRevalidate: true } } as const // no Next request here → skip revalidatePath

const empty = async (collection: 'practice-areas' | 'lawyers' | 'testimonials' | 'articles') =>
  (await payload.count({ collection })).totalDocs === 0

// ---- admin account (from .env, never hard-coded) ----
if ((await payload.count({ collection: 'users' })).totalDocs === 0) {
  const email = process.env.SEED_ADMIN_EMAIL
  const password = process.env.SEED_ADMIN_PASSWORD
  if (!email || !password) throw new Error('Isi SEED_ADMIN_EMAIL dan SEED_ADMIN_PASSWORD di .env')
  await payload.create({ collection: 'users', data: { email, password, name: 'Administrator', role: 'admin' } })
  payload.logger.info(`Admin dibuat: ${email}`)
}

// ---- site settings ----
await payload.updateGlobal({
  slug: 'site-settings',
  context: req.context,
  data: {
    phone: '+62 21 1234 5678',
    whatsapp: '+62 812 3456 7890',
    email: 'info@benaya-law.com',
    address: 'Jl. Sudirman No. 88, Jakarta Selatan 12190',
    hours: 'Senin–Jumat, 09.00–17.00',
    social: { linkedin: 'https://www.linkedin.com', instagram: 'https://www.instagram.com', youtube: 'https://www.youtube.com' },
    stats: [
      { value: '10+', label: 'Tahun Pengalaman', icon: 'award' },
      { value: '500+', label: 'Klien Dilayani', icon: 'users' },
      { value: '300+', label: 'Kasus Ditangani', icon: 'gavel' },
      { value: '6', label: 'Bidang Praktik Hukum', icon: 'layout-grid' },
    ],
  },
})

// ---- practice areas ----
if (await empty('practice-areas')) {
  const services = [
    ['Korporasi & Bisnis', 'Pendirian perusahaan, perjanjian bisnis, merger & akuisisi, dan konsultasi korporat.', 'file-text', ['perusahaan']],
    ['Litigasi & Penyelesaian Sengketa', 'Penyelesaian sengketa perdata, komersial, dan perwakilan hukum di pengadilan.', 'scale', ['perusahaan', 'individu']],
    ['Ketenagakerjaan', 'Perjanjian kerja, penyelesaian sengketa buruh, dan kepatuhan hukum ketenagakerjaan.', 'briefcase', ['perusahaan', 'individu']],
    ['Properti & Pertanahan', 'Transaksi properti, sengketa tanah, dan uji tuntas hukum.', 'home', ['perusahaan', 'individu']],
    ['Perdata & Keluarga', 'Penyelesaian masalah hukum perdata secara efektif dan efisien.', 'users', ['individu']],
    ['Pidana', 'Pendampingan hukum dalam perkara pidana dengan strategi terbaik.', 'shield', ['individu']],
  ] as const
  for (const [i, [title, description, icon, audiences]] of services.entries()) {
    await payload.create({ collection: 'practice-areas', context: req.context, data: { title, description, icon, audiences: [...audiences], order: i } })
  }
}

// ---- lawyers (portraits uploaded to Media; if the download fails, the site shows initials) ----
async function uploadPhoto(unsplashId: string, alt: string): Promise<number | undefined> {
  try {
    const res = await fetch(`https://images.unsplash.com/photo-${unsplashId}?w=640&h=800&fit=crop&crop=faces&fm=jpg`)
    if (!res.ok) throw new Error(String(res.status))
    const data = Buffer.from(await res.arrayBuffer())
    const doc = await payload.create({
      collection: 'media',
      data: { alt },
      file: { data, mimetype: 'image/jpeg', name: `${unsplashId}.jpg`, size: data.length },
    })
    return doc.id as number
  } catch (e) {
    payload.logger.warn(`Foto ${alt} gagal diunduh (${(e as Error).message}) — memakai inisial.`)
    return undefined
  }
}

if (await empty('lawyers')) {
  const lawyers = [
    ['Raka Pratama, S.H., M.H.', 'Managing Partner', 'Korporasi & Bisnis', '1507003211169-0a1dd7228f2d'],
    ['Siti Rahmawati, S.H.', 'Partner', 'Litigasi & Sengketa', '1573496359142-b8d87734a5a2'],
    ['Budi Santoso, S.H., M.H.', 'Senior Associate', 'Ketenagakerjaan', '1472099645785-5658abf4ff4e'],
    ['Dewi Lestari, S.H.', 'Associate', 'Perdata & Keluarga', '1594744803329-e58b31de8bf5'],
  ] as const
  for (const [i, [name, position, specialization, photoId]] of lawyers.entries()) {
    const photo = await uploadPhoto(photoId, `Foto ${name}`)
    await payload.create({ collection: 'lawyers', context: req.context, data: { name, position, specialization, photo, order: i } })
  }
}

// ---- testimonials (approved only so the demo shows them — replace with real, consented reviews) ----
if (await empty('testimonials')) {
  const t = [
    ['Sarah Wijaya', 'CEO, TechCorp', 'korporat', 'Tim Benaya sangat profesional dan responsif. Mereka benar-benar memahami kebutuhan bisnis kami.'],
    ['Andi Pranata', 'Direktur, Nusantara Group', 'korporat', 'Pelayanan yang sangat baik, komunikasi jelas, dan hasil yang memuaskan. Sangat direkomendasikan!'],
    ['Dewi Kartika', 'Founder, Velora', 'korporat', 'Pendekatan yang solutif dan strategi hukum yang tepat. Benaya adalah mitra yang dapat diandalkan.'],
    ['Michael Tan', 'CTO, GlobalTech', 'korporat', 'Dokumentasi jelas, proses profesional, dan tim yang sangat kompeten. Puas dengan layanan mereka.'],
    ['Rina Hartono', 'Owner, Ritel Maju', 'korporat', 'Penjelasan hukum yang mudah dipahami dan pendampingan penuh dari awal hingga selesai.'],
    ['R. Sari', 'Klien perkara waris', 'individu', 'Proses pembagian waris keluarga kami jadi jelas dan adil. Semua langkah dijelaskan dengan sabar.'],
    ['H. Gunawan', 'Klien sengketa tanah', 'individu', 'Sertifikat tanah kami akhirnya aman. Timnya teliti memeriksa setiap dokumen.'],
    ['D. Aditya', 'Klien ketenagakerjaan', 'individu', 'Hak pesangon saya diperjuangkan sampai tuntas. Saya merasa didampingi, bukan sekadar diwakili.'],
    ['M. Putri', 'Klien hak asuh anak', 'individu', 'Di masa yang berat, saya mendapat pendampingan yang tenang dan penuh empati.'],
    ['A. Nugroho', 'Klien perkara pidana', 'individu', 'Pendampingan sejak pemeriksaan awal. Komunikasinya cepat dan selalu transparan.'],
  ] as const
  for (const [clientName, clientRole, clientType, text] of t) {
    await payload.create({
      collection: 'testimonials',
      context: req.context,
      data: { clientName, clientRole, clientType, text, rating: 5, consentGiven: true, status: 'approved' },
    })
  }
}

// ---- articles (minimal Lexical documents) ----
const richText = (paragraphs: string[]) => ({
  root: {
    type: 'root',
    format: '' as const,
    indent: 0,
    version: 1,
    direction: 'ltr' as const,
    children: paragraphs.map((text) => ({
      type: 'paragraph',
      format: '' as const,
      indent: 0,
      version: 1,
      direction: 'ltr' as const,
      textFormat: 0,
      children: [{ type: 'text', text, format: 0, detail: 0, mode: 'normal', style: '', version: 1 }],
    })),
  },
})

if (await empty('articles')) {
  const articles = [
    ['individu', 'Waris', '2025-03-14', 'Langkah Hukum Membagi Warisan agar Tidak Berujung Sengketa', 'Panduan praktis membagi warisan secara sah dan adil agar hubungan keluarga tetap terjaga.'],
    ['perusahaan', 'Korporasi', '2025-03-12', 'Hal yang Perlu Diperhatikan dalam Pendirian Perusahaan di Indonesia', 'Pilihan badan usaha, perizinan berbasis risiko, dan dokumen yang wajib disiapkan.'],
    ['individu', 'Properti', '2025-03-10', 'Cara Memastikan Sertifikat Tanah Aman Sebelum Membeli', 'Langkah pengecekan sertifikat dan riwayat tanah sebelum transaksi properti.'],
    ['perusahaan', 'Bisnis', '2025-03-08', 'Memahami Kontrak Bisnis dan Risiko Hukum yang Perlu Diwaspadai', 'Klausul penting dalam kontrak bisnis yang sering menjadi sumber sengketa.'],
    ['individu', 'Keluarga', '2025-03-05', 'Hak Asuh Anak Setelah Perceraian: Yang Perlu Diketahui Orang Tua', 'Bagaimana pengadilan menentukan hak asuh dan apa yang dapat dipersiapkan orang tua.'],
    ['perusahaan', 'Ketenagakerjaan', '2025-03-03', 'Pentingnya Kepatuhan Hukum Ketenagakerjaan di Era Digital', 'Kewajiban perusahaan terkait kontrak kerja, kerja jarak jauh, dan perlindungan data karyawan.'],
  ] as const
  for (const [audience, category, date, title, excerpt] of articles) {
    await payload.create({
      collection: 'articles',
      context: req.context,
      data: {
        title,
        category,
        audience,
        excerpt,
        status: 'published',
        publishedAt: new Date(date).toISOString(),
        content: richText([
          excerpt,
          'Artikel ini adalah contoh konten (placeholder) untuk demonstrasi. Tim Benaya dapat mengganti isinya langsung dari dashboard CMS di /admin tanpa bantuan developer.',
          'Setiap situasi hukum bersifat unik. Untuk nasihat yang sesuai dengan kondisi Anda, silakan ajukan konsultasi melalui formulir di halaman utama.',
        ]),
      },
    })
  }
}

payload.logger.info('Seed selesai.')
process.exit(0)
