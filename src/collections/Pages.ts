import type { CollectionConfig } from 'payload'

import { authenticated } from '@/access/authenticated'
import { authenticatedOrPublished } from '@/access/authenticatedOrPublished'
import { slugField } from '@/fields/slug'
import { Archive } from '@/blocks/Archive/config'
import { CallToAction } from '@/blocks/CallToAction/config'
import { Code } from '@/blocks/Code/config'
import { Content } from '@/blocks/Content/config'
import { Hero } from '@/blocks/Hero/config'
import { MediaBlock } from '@/blocks/MediaBlock/config'

export const Pages: CollectionConfig = {
  slug: 'pages',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'status', 'updatedAt'],
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
      name: 'layout',
      type: 'blocks',
      required: true,
      blocks: [Hero, Content, MediaBlock, CallToAction, Archive, Code],
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
