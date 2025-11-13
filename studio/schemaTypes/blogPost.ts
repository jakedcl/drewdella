import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'blogPost',
  title: 'Blog Posts',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'The title of the blog post',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'date',
      title: 'Date',
      type: 'datetime',
      description: 'Publication date of the blog post',
      validation: (Rule) => Rule.required(),
      options: {
        dateFormat: 'YYYY-MM-DD',
        timeFormat: 'HH:mm',
        timeStep: 15,
        calendarTodayLabel: 'Today'
      }
    }),
    defineField({
      name: 'content',
      title: 'Content',
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
        {
          type: 'image',
          options: {
            hotspot: true,
          },
          fields: [
            {
              name: 'alt',
              title: 'Alt Text',
              type: 'string',
              description: 'Alternative text for the image (for accessibility)',
            },
            {
              name: 'caption',
              title: 'Caption',
              type: 'string',
              description: 'Optional caption for the image',
            },
            {
              name: 'size',
              title: 'Image Size',
              type: 'string',
              description: 'Control the display size of the image',
              options: {
                list: [
                  {title: 'Small', value: 'small'},
                  {title: 'Medium', value: 'medium'},
                  {title: 'Large', value: 'large'},
                  {title: 'Full Width', value: 'full'},
                ],
                layout: 'radio',
              },
              initialValue: 'medium',
            },
          ],
        }
      ],
      description: 'The main content of the blog post',
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
  ],
  orderings: [
    {
      title: 'Date (Newest First)',
      name: 'dateDesc',
      by: [
        {field: 'date', direction: 'desc'}
      ]
    },
    {
      title: 'Date (Oldest First)',
      name: 'dateAsc',
      by: [
        {field: 'date', direction: 'asc'}
      ]
    },
  ],
  preview: {
    select: {
      title: 'title',
      date: 'date',
    },
    prepare({title, date}) {
      const formattedDate = date ? new Date(date).toLocaleDateString() : 'No date'
      return {
        title,
        subtitle: formattedDate,
      }
    },
  },
})
