import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import { RichText } from '@payloadcms/richtext-lexical/react'
import Link from 'next/link'
import React from 'react'

import config from '@/payload.config'
import type { Post } from '@/payload-types'

export const dynamic = 'force-dynamic'

type RouteParams = { slug: string }

const findPublishedPostBySlug = async (slug: string): Promise<Post | null> => {
  const payload = await getPayload({ config: await config })

  const { docs } = await payload.find({
    collection: 'posts',
    where: {
      and: [
        { slug: { equals: slug } },
        { _status: { equals: 'published' } },
      ],
    },
    limit: 1,
    depth: 1,
  })

  if (docs.length === 0) {
    return null
  }

  return docs[0] as Post
}

export const generateMetadata = async (
  { params }: { params: Promise<RouteParams> },
): Promise<Metadata> => {
  const { slug } = await params
  const post = await findPublishedPostBySlug(slug)

  if (!post) {
    return { title: 'Post not found' }
  }

  return {
    title: post.meta?.title ?? post.title,
    description: post.meta?.description ?? post.excerpt ?? undefined,
  }
}

export default async function PostPage(
  { params }: { params: Promise<RouteParams> },
): Promise<React.ReactElement> {
  const { slug } = await params
  const post = await findPublishedPostBySlug(slug)

  if (!post) {
    notFound()
  }

  return (
    <article className="post">
      <p>
        <Link href="/">← Back to all posts</Link>
      </p>

      <header>
        <h1>{post.title}</h1>
        {post.publishedAt ? (
          <time dateTime={post.publishedAt}>
            {new Date(post.publishedAt).toLocaleDateString()}
          </time>
        ) : null}
        {post.excerpt ? <p className="excerpt">{post.excerpt}</p> : null}
      </header>

      <RichText data={post.content} />
    </article>
  )
}
