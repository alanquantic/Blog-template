import type { Access } from 'payload'

// Read access pattern for content that can be drafted.
// - Authenticated users can read any document (including drafts).
// - Anonymous visitors can only read documents whose `_status` is 'published'.
export const authenticatedOrPublished: Access = ({ req: { user } }) => {
  if (user) {
    return true
  }

  return {
    _status: {
      equals: 'published',
    },
  }
}
