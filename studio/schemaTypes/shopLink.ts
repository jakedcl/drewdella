import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'shopLink',
  title: 'Shopping Link',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'Display name (e.g., "Shopping", "Merch Store")',
      validation: (Rule) => Rule.required(),
      initialValue: 'Shopping',
    }),
    defineField({
      name: 'url',
      title: 'URL',
      type: 'url',
      description: 'Redirect URL for the Shopping tab',
      validation: (Rule) => Rule.required(),
      initialValue: 'https://www.drewdellamerch.com',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'url',
    },
  },
}) 