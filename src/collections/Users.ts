import type { CollectionConfig } from 'payload'

import { fieldAdminOnly, isAdmin, ROLES } from '../access/roles'

export const Users: CollectionConfig = {
  slug: 'users',
  labels: { singular: 'Pengguna', plural: 'Pengguna' },
  admin: { useAsTitle: 'email', defaultColumns: ['email', 'name', 'role'], group: 'Pengaturan' },
  auth: { maxLoginAttempts: 5, lockTime: 15 * 60 * 1000 },
  access: {
    // admins see everyone; everybody else only their own account
    read: ({ req }) => (isAdmin({ req }) ? true : req.user ? { id: { equals: req.user.id } } : false),
    create: isAdmin,
    update: ({ req }) => (isAdmin({ req }) ? true : req.user ? { id: { equals: req.user.id } } : false),
    delete: isAdmin,
  },
  hooks: {
    beforeChange: [
      // the very first account (created from the /admin setup screen) becomes admin
      async ({ data, operation, req }) => {
        if (operation === 'create') {
          const { totalDocs } = await req.payload.count({ collection: 'users', req })
          if (totalDocs === 0) data.role = 'admin'
        }
        return data
      },
    ],
  },
  fields: [
    { name: 'name', label: 'Nama', type: 'text' },
    {
      name: 'role',
      label: 'Peran',
      type: 'select',
      required: true,
      defaultValue: 'editor',
      options: ROLES.map((r) => ({ label: r[0].toUpperCase() + r.slice(1), value: r })),
      saveToJWT: true,
      access: { update: fieldAdminOnly },
    },
  ],
}
