import type { CollectionConfig } from 'payload'

import { anyone } from '@/access/anyone'
import { authenticated } from '@/access/authenticated'
import { slugField } from '@/fields/slug'

export const Categories: CollectionConfig = {
  slug: 'categories',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'slug'],
  },
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      type: 'textarea',
    },
    slugField('name'),
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
