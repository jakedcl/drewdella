import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'contact',
  title: 'Contact',
  type: 'document',
  fields: [
    defineField({
      name: 'email',
      title: 'Email',
      type: 'string',
      description: 'Public address shown on the Socials tab.',
      validation: (Rule) => Rule.required().email(),
    }),
  ],
  preview: {
    select: {title: 'email'},
    prepare({title}) {
      return {title: title || 'Contact'}
    },
  },
})
