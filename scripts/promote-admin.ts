// One-shot helper: promotes a user to role "admin".
// Usage:  npx payload run scripts/promote-admin.ts <email>
// Run from this folder. Loads .env via Payload's runtime.
import { getPayload } from 'payload'
import config from '../src/payload.config'

const main = async (): Promise<void> => {
  const email = process.argv[2]
  if (typeof email !== 'string' || email.length === 0) {
    throw new Error('Usage: npx payload run scripts/promote-admin.ts <email>')
  }

  const payload = await getPayload({ config })

  const found = await payload.find({
    collection: 'users',
    where: { email: { equals: email } },
    limit: 1,
    overrideAccess: true,
  })

  if (found.docs.length === 0) {
    throw new Error(`No user found with email=${email}`)
  }

  const user = found.docs[0]
  if (user === undefined) {
    throw new Error(`No user found with email=${email}`)
  }

  const updated = await payload.update({
    collection: 'users',
    id: user.id,
    data: { roles: ['admin'] },
    overrideAccess: true,
  })

  console.log('Promoted to admin:', { id: updated.id, email: updated.email, roles: updated.roles })
  process.exit(0)
}

main().catch((err: unknown) => {
  console.error(err instanceof Error ? err.message : String(err))
  process.exit(1)
})
