import type { Field } from 'payload'

const toSlug = (value: string): string => {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

// Reusable slug field paired with a source text field (typically `title`).
// Auto-fills from the source field when empty, otherwise leaves user input intact.
export const slugField = (sourceField: string): Field => ({
  name: 'slug',
  type: 'text',
  index: true,
  required: true,
  unique: true,
  admin: {
    position: 'sidebar',
    description: 'URL-friendly identifier. Auto-generated from the title if left empty.',
  },
  hooks: {
    beforeValidate: [
      ({ data, value }) => {
        if (typeof value === 'string' && value.length > 0) {
          return toSlug(value)
        }

        const source = data?.[sourceField]
        if (typeof source === 'string' && source.length > 0) {
          return toSlug(source)
        }

        return value
      },
    ],
  },
})
