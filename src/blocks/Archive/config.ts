import type { Block } from 'payload'

// Archive: a curated or auto-populated list of posts to embed inside a page.
// `populateBy: 'collection'` => filters by category/tag/limit at render time.
// `populateBy: 'selection'`  => the editor explicitly picks the posts.
export const Archive: Block = {
  slug: 'archive',
  interfaceName: 'ArchiveBlock',
  labels: {
    singular: 'Posts archive',
    plural: 'Posts archives',
  },
  fields: [
    {
      name: 'heading',
      type: 'text',
    },
    {
      name: 'populateBy',
      type: 'select',
      required: true,
      defaultValue: 'collection',
      options: [
        { label: 'By collection (auto)', value: 'collection' },
        { label: 'By manual selection', value: 'selection' },
      ],
    },
    {
      name: 'categories',
      type: 'relationship',
      relationTo: 'categories',
      hasMany: true,
      admin: {
        condition: (_, siblingData) => siblingData?.populateBy === 'collection',
      },
    },
    {
      name: 'limit',
      type: 'number',
      defaultValue: 10,
      admin: {
        condition: (_, siblingData) => siblingData?.populateBy === 'collection',
      },
    },
    {
      name: 'selectedDocs',
      type: 'relationship',
      relationTo: 'posts',
      hasMany: true,
      admin: {
        condition: (_, siblingData) => siblingData?.populateBy === 'selection',
      },
    },
  ],
}
