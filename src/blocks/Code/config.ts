import type { Block } from 'payload'

const SUPPORTED_LANGUAGES = [
  'typescript',
  'javascript',
  'tsx',
  'jsx',
  'json',
  'bash',
  'css',
  'html',
  'markdown',
  'python',
  'sql',
  'yaml',
  'plaintext',
] as const

export const Code: Block = {
  slug: 'code',
  interfaceName: 'CodeBlock',
  fields: [
    {
      name: 'language',
      type: 'select',
      required: true,
      defaultValue: 'typescript',
      options: SUPPORTED_LANGUAGES.map((lang) => ({ label: lang, value: lang })),
    },
    {
      name: 'code',
      type: 'code',
      required: true,
      admin: {
        language: 'typescript',
      },
    },
    {
      name: 'filename',
      type: 'text',
    },
  ],
}
