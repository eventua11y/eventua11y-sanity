import {defineType, defineField} from 'sanity'

export const event = defineType({
  title: "Events",
  name: "event",
  type: "document",
  fields: [
    defineField({
      title: "Title",
      name: "title",
      type: "string",
      validation: Rule => Rule.required()
    }),
    defineField({
      title: "Description",
      name: "description",
      type: "text",
      validation: Rule => Rule.required()
    }),
    defineField({
      title: "Type",
      name: "type",
      type: "string",
      initialValue: "normal",
      options: {
        list: [
          { title: 'Normal', value: 'normal' },
          { title: 'Theme', value: 'theme' },
        ],
        layout: 'radio'
      }
    }),
    defineField({
      title: 'This is a parent event',
      name: 'isParent',
      type: 'boolean',
      initialValue: false,
      description: 'Will this event have sub-events?',
      hidden: ({document}) => document?.type === 'theme'
    }),
    defineField({
      title: 'Part of',
      name: 'parent',
      type: 'reference',
      to: [{type: 'event'}],
      description: 'If this is part of a larger event, select it here.',
      hidden: ({document}) => document?.type === 'theme' || document?.isParent === true
    }),
    {
      title: 'Format',
      name: 'format',
      type: 'string',
      options: {
        list: [
          { title: 'Talk', value: 'talk' },
          { title: 'Workshop', value: 'workshop' },
          { title: 'Tutorial', value: 'tutorial' },
          { title: 'Roundtable', value: 'roundtable' },
          { title: 'Competition', value: 'competition' },
          { title: 'Panel', value: 'panel' },
          { title: 'Interview', value: 'interview' },
          { title: 'Demo', value: 'demo' },
          { title: 'Keynote', value: 'keynote' },
          { title: 'Announcement', value: 'announcement' },
          { title: 'Other', value: 'other' }
        ]
      }
    },
    defineField({
      title: 'Free of charge',
      name: 'isFree',
      type: 'boolean',
      initialValue: false
    }),
    defineField({
      title: "Attendance Mode",
      name: "attendanceMode",
      type: "string",
      validation: Rule => Rule.required(),
      initialValue: "hybrid",
      options: {
        list: [
          { title: 'Online', value: 'online' },
          { title: 'Offline', value: 'offline' },
          { title: 'Mixed', value: 'mixed'},
          { title: 'None', value: 'none'}
        ],
        layout: 'radio'
      },
      // hide if type is theme
      hidden: ({document}) => document?.type === 'theme'
    }),
    defineField({
      title: "Location",
      name: "location",
      type: "string",
      hidden: ({document}) => document?.attendanceMode === 'online'
    }),
    defineField({
      title: "Geo location",
      name: "geopoint",
      type: "geopoint",
    }),
    // defineField({
    //   title: "Country",
    //   name: "country",
    //   type: "countrieslist",
    //   options: {
    //     showStates: false,
    //     placeholder: 'Select country',
    //     showIcon: true,
    //   },
    // }),
    defineField({
      title: "Website",
      name: "website",
      type: "url"
    }),
    defineField({
      title: 'Call for speakers',
      name: 'callForSpeakers',
      type: 'boolean',
      initialValue: false,
      hidden: ({document}) => document?.type === 'theme'
    }),
    // Call for speakers closing date
    defineField({
      title: "Call for speakers closing date",
      name: "callForSpeakersClosingDate",
      type: "datetime",
      hidden: ({document}) => document?.callForSpeakers === false
    }),
    defineField({
      title: 'Scheduled',
      name: 'scheduled',
      type: 'boolean',
      initialValue: true,
      hidden: ({document}) => !document?.parent || document?.type === 'theme'
    }),
    defineField({
      title: "Starts",
      name: "dateStart",
      type: "datetime",
      hidden: ({document}) => document?.scheduled === false
    }),
    defineField({
      title: "Ends",
      name: "dateEnd",
      type: "datetime",
      hidden: ({document}) => document?.scheduled === false
    }),
    defineField({
      title: "Timezone",
      name: "timezone",
      type: "string",
      description: "Must be IANA timezone name (e.g., 'America/New_York', 'Europe/London', 'Asia/Tokyo', 'Australia/Sydney', 'Europe/Berlin', 'Asia/Dubai', 'America/Los_Angeles', 'Europe/Moscow', 'Asia/Kolkata', 'America/New_York', 'America/Los_Angeles'). Cannot use abbreviations (EST, PST, etc.)",
      hidden: ({document}) => document?.scheduled === false
    }),
    defineField({
      title: "All day",
      name: "day",
      type: "boolean",
      initialValue: false
    })
  ],
  orderings: [
    {
      title: 'Chronological',
      name: 'dateStartAsc',
      by: [
        {field: 'dateStart', direction: 'asc'}
      ]
    },
    {
      title: 'Reverse Chronological',
      name: 'dateStartDesc',
      by: [
        {field: 'dateStart', direction: 'desc'}
      ]
    }
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'dateStart'
    }
  }
})

export default event;
