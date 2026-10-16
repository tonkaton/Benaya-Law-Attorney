import type { CollectionConfig } from 'payload'

import { isContentStaff, isLoggedIn } from '../access/roles'

export const Media: CollectionConfig = {
  slug: 'media',
  labels: { singular: 'Media', plural: 'Media' },
  admin: { group: 'Konten' },
  access: {
    read: () => true,
    create: isLoggedIn, // lawyers upload their own portrait
    update: isContentStaff,
    delete: isContentStaff,
  },
  fields: [{ name: 'alt', label: 'Teks alternatif', type: 'text', required: true }],
  upload: {
    mimeTypes: ['image/*'],
    imageSizes: [{ name: 'card', width: 640 }],
  },
}
