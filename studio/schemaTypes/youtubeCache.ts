import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'youtubeCache',
  title: 'YouTube cache',
  type: 'document',
  fields: [
    defineField({
      name: 'syncedAt',
      title: 'Last synced',
      type: 'datetime',
      readOnly: true,
      description: 'Updated by the daily Vercel cron. Do not edit by hand.',
    }),
    defineField({
      name: 'videos',
      title: 'Videos',
      type: 'array',
      readOnly: true,
      of: [
        {
          type: 'object',
          fields: [
            defineField({name: 'id', title: 'YouTube ID', type: 'string'}),
            defineField({name: 'title', title: 'Title', type: 'string'}),
            defineField({
              name: 'thumbnail',
              title: 'Thumbnail',
              type: 'url',
            }),
            defineField({
              name: 'publishedAt',
              title: 'Published',
              type: 'datetime',
            }),
          ],
          preview: {
            select: {
              title: 'title',
              subtitle: 'id',
            },
          },
        },
      ],
    }),
  ],
  preview: {
    select: {
      subtitle: 'syncedAt',
    },
    prepare({subtitle}) {
      return {
        title: 'YouTube cache',
        subtitle: subtitle ? `Synced ${subtitle}` : 'Not synced yet',
      }
    },
  },
})
