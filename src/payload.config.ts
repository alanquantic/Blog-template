import path from 'path'
import { fileURLToPath } from 'url'

import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { redirectsPlugin } from '@payloadcms/plugin-redirects'
import { searchPlugin } from '@payloadcms/plugin-search'
import { seoPlugin } from '@payloadcms/plugin-seo'
import { buildConfig } from 'payload'
import sharp from 'sharp'

import { Categories } from './collections/Categories'
import { Media } from './collections/Media'
import { Pages } from './collections/Pages'
import { Posts } from './collections/Posts'
import { Tags } from './collections/Tags'
import { Users } from './collections/Users'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const databaseUrl = process.env.DATABASE_URL
if (!databaseUrl) {
  throw new Error(
    'DATABASE_URL is not set. Configure it (Neon connection string) before starting the app.',
  )
}

const payloadSecret = process.env.PAYLOAD_SECRET
if (!payloadSecret) {
  throw new Error('PAYLOAD_SECRET is not set. Generate a long random string and set it.')
}

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    livePreview: {
      breakpoints: [
        { label: 'Mobile', name: 'mobile', width: 375, height: 667 },
        { label: 'Tablet', name: 'tablet', width: 768, height: 1024 },
        { label: 'Desktop', name: 'desktop', width: 1440, height: 900 },
      ],
    },
  },
  collections: [Pages, Posts, Categories, Tags, Media, Users],
  editor: lexicalEditor(),
  secret: payloadSecret,
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: databaseUrl,
    },
  }),
  sharp,
  plugins: [
    seoPlugin({
      collections: ['posts', 'pages'],
      uploadsCollection: 'media',
      generateTitle: ({ doc }) => {
        const title = (doc as { title?: unknown })?.title
        return typeof title === 'string' ? title : ''
      },
    }),
    redirectsPlugin({
      collections: ['posts', 'pages'],
      overrides: {
        admin: {
          group: 'Admin',
        },
      },
    }),
    searchPlugin({
      collections: ['posts', 'pages'],
      defaultPriorities: {
        posts: 10,
        pages: 5,
      },
    }),
  ],
})
