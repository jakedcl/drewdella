import {defineField, defineType} from 'sanity'
import {CommentIcon} from '@sanity/icons'

export default defineType({
  name: 'chatMessage',
  title: 'Chat message',
  type: 'document',
  icon: CommentIcon,
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (rule) => rule.required().min(1).max(24),
    }),
    defineField({
      name: 'body',
      title: 'Message',
      type: 'text',
      rows: 3,
      validation: (rule) => rule.required().min(1).max(280),
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'body',
    },
  },
  orderings: [
    {
      title: 'Newest first',
      name: 'createdDesc',
      by: [{field: '_createdAt', direction: 'desc'}],
    },
  ],
})
