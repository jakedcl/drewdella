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
      description:
        'Where Store goes. Use https://drewdella.com/shop for the coming-soon page. When real merch launches, put the external store URL here instead.',
      validation: (Rule) => Rule.required(),
      initialValue: 'https://drewdella.com/shop',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'url',
    },
  },
}) 