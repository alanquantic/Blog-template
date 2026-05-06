import type { CollectionConfig } from 'payload'
import {
  FixedToolbarFeature,
  HeadingFeature,
  HorizontalRuleFeature,
  InlineToolbarFeature,
  lexicalEditor,
  LinkFeature,
} from '@payloadcms/richtext-lexical'

import { authenticated } from '@/access/authenticated'
import { authenticatedOrPublished } from '@/access/authenticatedOrPublished'
import { slugField } from '@/fields/slug'
import { Code } from '@/blocks/Code/config'
import { Content } from '@/blocks/Content/config'
import { MediaBlock } from '@/blocks/MediaBlock/config'

export const Posts: CollectionConfig = {
  slug: 'posts',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'status', 'publishedAt', 'updatedAt'],
  },
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticatedOrPublished,
    update: authenticated,
  },
  versions: {
    drafts: {
      autosave: { interval: 100 },
      schedulePublish: true,
    },
    maxPerDoc: 50,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'excerpt',
      type: 'textarea',
      maxLength: 280,
    },
    {
      name: 'heroImage',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'content',
      type: 'richText',
      required: true,
      editor: lexicalEditor({
        features: ({ rootFeatures }) => [
          ...rootFeatures,
          HeadingFeature({ enabledHeadingSizes: ['h2', 'h3', 'h4'] }),
          LinkFeature({ enabledCollections: ['posts', 'pages'] }),
          FixedToolbarFeature(),
          InlineToolbarFeature(),
          HorizontalRuleFeature(),
        ],
      }),
    },
    {
      name: 'extraBlocks',
      type: 'blocks',
      label: 'Embedded blocks (optional)',
      blocks: [Content, MediaBlock, Code],
    },
    {
      name: 'categories',
      type: 'relationship',
      relationTo: 'categories',
      hasMany: true,
      admin: { position: 'sidebar' },
    },
    {
      name: 'tags',
      type: 'relationship',
      relationTo: 'tags',
      hasMany: true,
      admin: { position: 'sidebar' },
    },
    {
      name: 'authors',
      type: 'relationship',
      relationTo: 'users',
      hasMany: true,
      required: true,
      admin: { position: 'sidebar' },
    },
    {
      name: 'publishedAt',
      type: 'date',
      admin: {
        position: 'sidebar',
        date: { pickerAppearance: 'dayAndTime' },
      },
      hooks: {
        beforeChange: [
          ({ siblingData, value }) => {
            // When transitioning a draft to published, stamp publishedAt automatically.
            if (siblingData?._status === 'published' && !value) {
              return new Date().toISOString()
            }
            return value
          },
        ],
      },
    },
    slugField('title'),
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
    {
      name: 'legacy_content_html',
      type: 'textarea',
      admin: {
        readOnly: true,
        description:
          'Original WordPress HTML preserved verbatim. Read-only; useful to recover shortcodes/embeds that the Markdown→Lexical conversion dropped.',
      },
    },
  ],
}
