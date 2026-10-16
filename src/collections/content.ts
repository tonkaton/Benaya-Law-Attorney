import type { CollectionConfig, Field, Where } from 'payload'

import {
  fieldAdminOrPartner,
  fieldContentStaff,
  hasRole,
  isAdminOrPartner,
  isContentStaff,
  staffOrOwn,
} from '../access/roles'
import { revalidateHooks } from '../hooks/revalidate'

export const AUDIENCES = [
  { label: 'Perusahaan', value: 'perusahaan' },
  { label: 'Individu', value: 'individu' },
] as const

const order: Field = {
  name: 'order',
  label: 'Urutan',
  type: 'number',
  defaultValue: 0,
  admin: { position: 'sidebar', description: 'Angka kecil tampil lebih dulu.' },
}

/** Public may read; content staff manage. */
const publicContentAccess = {
  read: () => true,
  create: isContentStaff,
  update: isContentStaff,
  delete: isAdminOrPartner,
}

export const PracticeAreas: CollectionConfig = {
  slug: 'practice-areas',
  labels: { singular: 'Layanan', plural: 'Layanan Hukum' },
  admin: { useAsTitle: 'title', defaultColumns: ['title', 'audiences', 'order'], group: 'Konten' },
  defaultSort: 'order',
  access: publicContentAccess,
  hooks: revalidateHooks,
  fields: [
    { name: 'title', label: 'Judul', type: 'text', required: true },
    { name: 'description', label: 'Deskripsi', type: 'textarea', required: true, maxLength: 200 },
    {
      name: 'icon',
      label: 'Ikon',
      type: 'select',
      required: true,
      options: ['file-text', 'scale', 'briefcase', 'home', 'users', 'shield'].map((v) => ({ label: v, value: v })),
    },
    {
      name: 'audiences',
      label: 'Untuk klien',
      type: 'select',
      hasMany: true,
      required: true,
      options: [...AUDIENCES],
      admin: { description: 'Menentukan di filter mana layanan ini muncul.' },
    },
    order,
  ],
}

export const Lawyers: CollectionConfig = {
  slug: 'lawyers',
  labels: { singular: 'Pengacara', plural: 'Tim Pengacara' },
  admin: { useAsTitle: 'name', defaultColumns: ['name', 'position', 'order'], group: 'Konten' },
  defaultSort: 'order',
  access: {
    read: () => true,
    create: isAdminOrPartner,
    update: staffOrOwn('user', ['admin', 'partner']), // lawyers edit only their own profile
    delete: isAdminOrPartner,
  },
  hooks: revalidateHooks,
  fields: [
    { name: 'name', label: 'Nama & gelar', type: 'text', required: true },
    { name: 'position', label: 'Jabatan', type: 'text', required: true },
    { name: 'specialization', label: 'Spesialisasi', type: 'text', required: true },
    { name: 'photo', label: 'Foto', type: 'upload', relationTo: 'media' },
    {
      name: 'user',
      label: 'Akun pengguna',
      type: 'relationship',
      relationTo: 'users',
      admin: { position: 'sidebar', description: 'Akun Lawyer yang boleh mengedit profil ini.' },
      access: { update: fieldAdminOrPartner },
    },
    order,
  ],
}

const PUBLISHABLE_TESTIMONIAL: Where = { and: [{ status: { equals: 'approved' } }, { consentGiven: { equals: true } }] }

export const Testimonials: CollectionConfig = {
  slug: 'testimonials',
  labels: { singular: 'Testimoni', plural: 'Testimoni' },
  admin: { useAsTitle: 'clientName', defaultColumns: ['clientName', 'clientType', 'status'], group: 'Konten' },
  access: {
    // PRD: never publish unapproved or non-consented reviews
    read: ({ req }) => (req.user ? true : PUBLISHABLE_TESTIMONIAL),
    create: isContentStaff,
    update: isContentStaff,
    delete: isAdminOrPartner,
  },
  hooks: revalidateHooks,
  fields: [
    { name: 'clientName', label: 'Nama klien / sebutan anonim', type: 'text', required: true },
    { name: 'clientRole', label: 'Jabatan / keterangan', type: 'text', required: true },
    { name: 'text', label: 'Isi testimoni', type: 'textarea', required: true, maxLength: 300 },
    { name: 'rating', label: 'Rating (opsional)', type: 'number', min: 1, max: 5 },
    {
      name: 'clientType',
      label: 'Jenis klien',
      type: 'select',
      required: true,
      defaultValue: 'korporat',
      options: [
        { label: 'Korporat', value: 'korporat' },
        { label: 'Individu', value: 'individu' },
      ],
    },
    {
      name: 'consentGiven',
      label: 'Klien sudah memberi izin publikasi',
      type: 'checkbox',
      defaultValue: false,
      admin: { position: 'sidebar' },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'pending',
      options: [
        { label: 'Menunggu persetujuan', value: 'pending' },
        { label: 'Disetujui', value: 'approved' },
        { label: 'Ditolak', value: 'rejected' },
      ],
      access: { update: fieldAdminOrPartner, create: fieldAdminOrPartner },
      admin: { position: 'sidebar' },
    },
  ],
}

const slugify = (s: string) =>
  s.toLowerCase().normalize('NFKD').replace(/[^\w\s-]/g, '').trim().replace(/[\s_-]+/g, '-').slice(0, 80)

export const Articles: CollectionConfig = {
  slug: 'articles',
  labels: { singular: 'Artikel', plural: 'Artikel' },
  admin: { useAsTitle: 'title', defaultColumns: ['title', 'category', 'status', 'publishedAt'], group: 'Konten' },
  defaultSort: '-publishedAt',
  access: {
    read: ({ req }) => (req.user ? true : { status: { equals: 'published' } }),
    create: hasRole('admin', 'partner', 'editor', 'lawyer'),
    update: staffOrOwn('createdBy', ['admin', 'partner', 'editor']), // lawyers edit their own drafts
    delete: isAdminOrPartner,
  },
  hooks: {
    ...revalidateHooks,
    beforeValidate: [
      ({ data, operation, req }) => {
        if (data && !data.slug && data.title) data.slug = slugify(data.title)
        if (data && operation === 'create' && req.user) data.createdBy = req.user.id
        return data
      },
    ],
  },
  fields: [
    { name: 'title', label: 'Judul', type: 'text', required: true },
    { name: 'slug', type: 'text', unique: true, index: true, admin: { position: 'sidebar', description: 'Otomatis dari judul jika kosong.' } },
    { name: 'category', label: 'Kategori', type: 'text', required: true },
    { name: 'audience', label: 'Untuk klien', type: 'select', required: true, options: [...AUDIENCES] },
    { name: 'excerpt', label: 'Ringkasan', type: 'textarea', maxLength: 240 },
    { name: 'cover', label: 'Gambar sampul', type: 'upload', relationTo: 'media' },
    { name: 'content', label: 'Isi artikel', type: 'richText' },
    {
      name: 'publishedAt',
      label: 'Tanggal terbit',
      type: 'date',
      required: true,
      defaultValue: () => new Date().toISOString(),
      admin: { position: 'sidebar' },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'draft',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Terbit', value: 'published' },
      ],
      access: { update: fieldContentStaff, create: fieldContentStaff }, // lawyers write drafts only
      admin: { position: 'sidebar' },
    },
    {
      name: 'createdBy',
      type: 'relationship',
      relationTo: 'users',
      admin: { position: 'sidebar', readOnly: true },
    },
  ],
}

export const ConsultationRequests: CollectionConfig = {
  slug: 'consultation-requests',
  labels: { singular: 'Permintaan Konsultasi', plural: 'Permintaan Konsultasi' },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'service', 'status', 'createdAt'],
    group: 'Klien',
    description: 'Data pribadi (UU PDP): akses terbatas, jangan diekspor tanpa keperluan.',
  },
  defaultSort: '-createdAt',
  access: {
    create: () => false, // only via the validated Server Action (Local API)
    read: staffOrOwn('assignedTo', ['admin', 'partner']),
    update: staffOrOwn('assignedTo', ['admin', 'partner']),
    delete: hasRole('admin'),
  },
  fields: [
    { name: 'name', label: 'Nama', type: 'text', required: true },
    { name: 'email', type: 'email', required: true },
    { name: 'phone', label: 'Telepon', type: 'text', required: true },
    { name: 'service', label: 'Jenis layanan', type: 'text', required: true },
    { name: 'message', label: 'Pesan', type: 'textarea', required: true },
    { name: 'consentAt', label: 'Persetujuan privasi', type: 'date', required: true, admin: { readOnly: true } },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'baru',
      options: [
        { label: 'Baru', value: 'baru' },
        { label: 'Sudah dihubungi', value: 'dihubungi' },
        { label: 'Selesai', value: 'selesai' },
        { label: 'Arsip', value: 'arsip' },
      ],
      admin: { position: 'sidebar' },
    },
    {
      name: 'assignedTo',
      label: 'Ditangani oleh',
      type: 'relationship',
      relationTo: 'users',
      admin: { position: 'sidebar' },
      access: { update: fieldAdminOrPartner },
    },
  ],
}
