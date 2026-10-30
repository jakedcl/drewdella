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
    defineField({
      name: 'ogImage',
      title: 'Social share image',
      type: 'image',
      description:
        'Optional default for link previews (Open Graph / Twitter). Falls back to the featured album cover, then the first gallery photo.',
      options: { hotspot: true },
    }),
  ],
  preview: {
    select: {title: 'email'},
    prepare({title}) {
      return {title: title || 'Contact'}
    },
  },
})
