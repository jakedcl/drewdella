import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'mapLocation',
  title: 'Map Location',
  type: 'document',
  fields: [
    defineField({
      name: 'venueName',
      title: 'Venue Name',
      type: 'string',
      description: 'Type the name of the venue (e.g., Bowery Ballroom, NYC)',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'address',
      title: 'Address (optional)',
      type: 'string',
      description: 'Type the full address if the venue name is ambiguous or not found',
    }),
    defineField({
      name: 'coordinates',
      title: 'Coordinates (optional)',
      type: 'geopoint',
      description: 'If the pin is wrong, paste the coordinates here (overrides venue name/address)',
    }),
  ],
  preview: {
    select: {
      title: 'venueName',
      subtitle: 'address',
    },
  },
}) 