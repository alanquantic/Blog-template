import type { CollectionConfig } from 'payload'

import { authenticated } from '@/access/authenticated'
import { isAdmin, isAdminFieldLevel } from '@/access/isAdmin'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'name', 'roles'],
  },
  auth: true,
  access: {
    create: isAdmin,
    delete: isAdmin,
    read: authenticated,
    update: ({ req: { user }, id }) => {
      if (!user) {
        return false
      }
      if (Array.isArray(user.roles) && user.roles.includes('admin')) {
        return true
      }
      return user.id === id
    },
    admin: authenticated,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'roles',
      type: 'select',
      hasMany: true,
      required: true,
      defaultValue: ['author'],
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'Editor', value: 'editor' },
        { label: 'Author', value: 'author' },
      ],
      access: {
        update: isAdminFieldLevel,
      },
    },
    {
      name: 'legacy_wp_id',
      type: 'number',
      index: true,
      admin: {
        readOnly: true,
        position: 'sidebar',
        description: 'Original WordPress ID. Set by the migration script to make re-runs idempotent.',
      },
    },
  ],
}
