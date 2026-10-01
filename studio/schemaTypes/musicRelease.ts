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
      description: 'Primary listen link (e.g., https://li.sten.to/album)',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      description: 'URL for the release page (/music/this-slug). Leave blank and the site builds one from the title.',
      options: {
        source: 'title',
        maxLength: 96,
      },
    }),
    defineField({
      name: 'subtitle',
      title: 'Subtitle',
      type: 'string',
      description: 'Short line under the title, e.g. “4 someone I miss daily”.',
    }),
    defineField({
      name: 'year',
      title: 'Year',
      type: 'number',
      description: 'Release year, if you don’t want a full date.',
      validation: (Rule) => Rule.min(1990).max(2100),
    }),
    defineField({
      name: 'cover',
      title: 'Cover art',
      type: 'image',
      description: 'Square cover. Shown on Music and the release page.',
      options: { hotspot: true },
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt text',
          type: 'string',
        }),
      ],
    }),
    defineField({
      name: 'story',
      title: 'Liner notes',
      type: 'text',
      description: 'Longer story for the release page. The short description is used until this is filled in.',
    }),
    defineField({
      name: 'featured',
      title: 'Featured showcase',
      type: 'boolean',
      description: 'Show this release as the large panel. If none are featured, the first by display order is used.',
      initialValue: false,
    }),
    defineField({
      name: 'links',
      title: 'More listen links',
      type: 'array',
      description: 'Extra platforms. The streaming URL above is always the primary Listen button.',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'label', title: 'Label', type: 'string' }),
            defineField({ name: 'url', title: 'URL', type: 'url' }),
          ],
        },
      ],
    }),
    defineField({
      name: 'tracks',
      title: 'Tracklist',
      type: 'array',
      description: 'Optional. If empty, the site lists Lyrics documents whose album name matches this title.',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'title',
              title: 'Title',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'duration',
              title: 'Duration',
              type: 'string',
              description: 'Optional, e.g. 3:12',
            }),
          ],
        },
      ],
    }),
    defineField({
      name: 'gallery',
      title: 'Imagery',
      type: 'array',
      description: 'Photos for the release page.',
      of: [
        {
          type: 'image',
          options: { hotspot: true },
          fields: [
            defineField({ name: 'alt', title: 'Alt text', type: 'string' }),
            defineField({ name: 'caption', title: 'Caption', type: 'string' }),
          ],
        },
      ],
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
      year: 'year',
      media: 'cover',
    },
    prepare({title, subtitle, date, year, media}) {
      const when = year || (date ? new Date(date).getFullYear() : '')
      return {
        title,
        subtitle: [when, subtitle].filter(Boolean).join(' — '),
        media,
      }
    },
  },
}) 