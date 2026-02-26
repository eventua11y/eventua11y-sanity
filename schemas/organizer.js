import {defineType, defineField} from 'sanity'

export const organizer = defineType({
  title: 'Organizers',
  name: 'organizer',
  type: 'document',
  fields: [
    defineField({
      title: 'Name',
      name: 'name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      title: 'Website',
      name: 'website',
      type: 'url',
    }),
  ],
})

export default organizer
