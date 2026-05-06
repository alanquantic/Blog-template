import type { Block } from 'payload'

export const CallToAction: Block = {
  slug: 'callToAction',
  interfaceName: 'CallToActionBlock',
  labels: {
    singular: 'Call to action',
    plural: 'Calls to action',
  },
  fields: [
    {
      name: 'heading',
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      type: 'textarea',
    },
    {
      name: 'buttonLabel',
      type: 'text',
      required: true,
    },
    {
      name: 'buttonHref',
      type: 'text',
      required: true,
    },
  ],
}
