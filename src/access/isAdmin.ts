import type { Access, FieldAccess } from 'payload'
import type { User } from '@/payload-types'

const hasAdminRole = (user: User | null): boolean => {
  if (!user) {
    return false
  }
  return Array.isArray(user.roles) && user.roles.includes('admin')
}

// Document-level: admin-only access.
export const isAdmin: Access<User> = ({ req: { user } }) => {
  return hasAdminRole(user)
}

// Field-level: admin-only access (e.g. to hide/disable fields for non-admins).
export const isAdminFieldLevel: FieldAccess<{ id: string }, User> = ({ req: { user } }) => {
  return hasAdminRole(user)
}
