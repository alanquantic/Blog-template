import type { AccessArgs } from 'payload'
import type { User } from '@/payload-types'

type IsAuthenticated = (args: AccessArgs<User>) => boolean

// Restrict access to any logged-in user, regardless of role.
export const authenticated: IsAuthenticated = ({ req: { user } }) => {
  return Boolean(user)
}
