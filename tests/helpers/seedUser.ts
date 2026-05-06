import { getPayload } from 'payload'
import config from '../../src/payload.config.js'

export const testUser = {
  email: 'dev@example.com',
  password: 'test',
  name: 'Test Admin',
  roles: ['admin'] as const,
}

/**
 * Seeds a test user for e2e admin tests.
 */
export async function seedTestUser(): Promise<void> {
  const payload = await getPayload({ config })

  await payload.delete({
    collection: 'users',
    where: {
      email: { equals: testUser.email },
    },
  })

  await payload.create({
    collection: 'users',
    data: {
      email: testUser.email,
      password: testUser.password,
      name: testUser.name,
      roles: [...testUser.roles],
    },
  })
}

/**
 * Cleans up test user after tests
 */
export async function cleanupTestUser(): Promise<void> {
  const payload = await getPayload({ config })

  await payload.delete({
    collection: 'users',
    where: {
      email: {
        equals: testUser.email,
      },
    },
  })
}
