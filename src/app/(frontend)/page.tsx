import { getPayload } from 'payload'
import Link from 'next/link'
import React from 'react'

import config from '@/payload.config'

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const payload = await getPayload({ config: await config })

  const { docs: posts } = await payload.find({
    collection: 'posts',
    where: { _status: { equals: 'published' } },
    sort: '-publishedAt',
    limit: 10,
    depth: 1,
  })

  return (
    <div className="home">
      <header className="content">
        <h1>Blog Template</h1>
        <p>
          Reusable blog template: Payload 3 + Next.js + Postgres (Neon).
          Replace this page with the real branding for each blog you fork.
        </p>
        <p>
          <Link href="/admin" className="admin">
            Open admin panel
          </Link>
        </p>
      </header>

      <section className="content">
        <h2>Latest posts</h2>
        {posts.length === 0 ? (
          <p>
            No posts published yet. Sign in to the admin panel and create your first post.
          </p>
        ) : (
          <ul>
            {posts.map((post) => (
              <li key={post.id}>
                <Link href={`/posts/${post.slug}`}>{post.title}</Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}
