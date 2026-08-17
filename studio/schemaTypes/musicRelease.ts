import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'musicRelease',
  title: 'Music',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'Name of the release',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      description: 'Brief description of the release',
    }),
    defineField({
      name: 'date',
      title: 'Release date',
      type: 'date',
      description: 'When this release came out. Shown on Music and All listings.',
      options: {
        dateFormat: 'YYYY-MM-DD',
      },
    }),
    defineField({
      name: 'url',
      title: 'Streaming URL',
      type: 'url',
      description: 'Link to streaming platform (e.g., https://li.sten.to/album)',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
      description: 'Order to display releases (lower numbers appear first)',
      initialValue: 0,
    }),
  ],
  orderings: [
    {
      title: 'Display Order',
      name: 'displayOrderAsc',
      by: [
        {field: 'order', direction: 'asc'}
      ]
    },
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'description',
      date: 'date',
    },
    prepare({title, subtitle, date}) {
      const when = date ? new Date(date).toLocaleDateString() : ''
      return {
        title,
        subtitle: [when, subtitle].filter(Boolean).join(' — '),
      }
    },
  },
}) 