import {defineType, defineField} from 'sanity'

export const topic = defineType({
  title: 'Topics',
  name: 'topic',
  type: 'document',
  fields: [
    defineField({
      title: 'Name',
      name: 'name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      title: 'Slug',
      name: 'slug',
      type: 'slug',
      options: {
        source: 'name',
      },
    }),
    defineField({
      title: 'Description',
      name: 'description',
      type: 'text',
      description: 'Short plain-text summary of this topic, used in listings and metadata.',
    }),
    defineField({
      title: 'Body',
      name: 'body',
      type: 'array',
      of: [{type: 'block'}],
    }),
  ],
  preview: {
    select: {
      title: 'name',
    },
  },
})

export default topic
