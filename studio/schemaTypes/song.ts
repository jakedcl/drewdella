import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'song',
  title: 'Songs',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Song Title',
      type: 'string',
      description: 'The title of the song',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'album',
      title: 'Album',
      type: 'string',
      description: 'The album this song belongs to (leave empty for singles)',
    }),
    defineField({
      name: 'lyrics',
      title: 'Lyrics',
      type: 'array',
      of: [
        {
          type: 'block',
          styles: [
            {title: 'Normal', value: 'normal'},
            {title: 'H1', value: 'h1'},
            {title: 'H2', value: 'h2'},
            {title: 'H3', value: 'h3'},
            {title: 'Quote', value: 'blockquote'},
          ],
          lists: [
            {title: 'Bullet', value: 'bullet'},
            {title: 'Number', value: 'number'}
          ],
          marks: {
            decorators: [
              {title: 'Strong', value: 'strong'},
              {title: 'Emphasis', value: 'em'},
              {title: 'Code', value: 'code'},
            ],
            annotations: [
              {
                title: 'URL',
                name: 'link',
                type: 'object',
                fields: [
                  {
                    title: 'URL',
                    name: 'href',
                    type: 'url',
                  }
                ]
              }
            ]
          }
        },
      ],
      description: 'The lyrics content of the song',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      description: 'URL-friendly version of the title',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
      description: 'Order to display songs within album (lower numbers appear first)',
      initialValue: 0,
    }),
  ],
  orderings: [
    {
      title: 'Album, then Order',
      name: 'albumOrderAsc',
      by: [
        {field: 'album', direction: 'asc'},
        {field: 'order', direction: 'asc'}
      ]
    },
  ],
  preview: {
    select: {
      title: 'title',
      album: 'album',
    },
    prepare({title, album}) {
      return {
        title,
        subtitle: album || 'Single',
      }
    },
  },
})
