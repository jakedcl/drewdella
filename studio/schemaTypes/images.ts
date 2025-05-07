import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'imageGallery',
  title: 'Image Gallery',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Gallery Title',
      type: 'string',
      description: 'A title for this gallery (for your reference)',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'galleryImages',
      title: 'Gallery Images',
      type: 'array',
      of: [
        {
          type: 'image',
          options: {
            hotspot: true, // Enables the hotspot for more flexible cropping
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
          ],
        },
      ],
      options: {
        layout: 'grid', // Displays images in a grid in the Studio
      },
    }),
  ],
  preview: {
    select: {
      title: 'title',
      media: 'galleryImages.0',
    },
    prepare({title, media}) {
      return {
        title,
        subtitle: 'Image Gallery',
        media,
      }
    },
  },
}) 