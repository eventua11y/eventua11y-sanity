import {defineType, defineField} from 'sanity'

export const book = defineType({
  title: "Books",
  name: "book",
  type: "document",
  fields: [
    defineField({
      title: "Title",
      name: "title",
      type: "string"
    }),
    defineField({
      title: "Link",
      name: "link",
      type: "url"
    }),
    defineField({
    title: "Date",
    name: "date",
    type: "date"
    }),
  ]
})

export default book;
