import React from 'react'
import './styles.css'

export const metadata = {
  description: 'Reusable blog template (Payload 3 + Next.js + Postgres).',
  title: 'Blog Template',
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <html lang="en">
      <body>
        <main>{children}</main>
      </body>
    </html>
  )
}
