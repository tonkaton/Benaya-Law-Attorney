import type { GlobalConfig } from 'payload'

import { isAdmin } from '../access/roles'
import { revalidateGlobal } from '../hooks/revalidate'

/** Contact details, hours and firm statistics — edited in one place, shown across the site. */
export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Pengaturan Situs',
  admin: { group: 'Pengaturan' },
  access: { read: () => true, update: isAdmin },
  hooks: { afterChange: [revalidateGlobal] },
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'phone', label: 'Telepon kantor', type: 'text', required: true },
        { name: 'whatsapp', label: 'WhatsApp', type: 'text', required: true },
        { name: 'email', type: 'email', required: true },
      ],
    },
    { name: 'address', label: 'Alamat', type: 'text', required: true },
    { name: 'hours', label: 'Jam kerja', type: 'text', required: true },
    {
      name: 'social',
      label: 'Media sosial',
      type: 'group',
      fields: [
        { name: 'linkedin', type: 'text' },
        { name: 'instagram', type: 'text' },
        { name: 'youtube', type: 'text' },
      ],
    },
    {
      name: 'stats',
      label: 'Statistik firma',
      type: 'array',
      maxRows: 4,
      admin: { description: 'Hanya angka yang dapat dibuktikan (PRD FR-04).' },
      fields: [
        { name: 'value', label: 'Angka', type: 'text', required: true },
        { name: 'label', type: 'text', required: true },
        {
          name: 'icon',
          label: 'Ikon',
          type: 'select',
          required: true,
          options: ['award', 'users', 'gavel', 'layout-grid'].map((v) => ({ label: v, value: v })),
        },
      ],
    },
  ],
}
