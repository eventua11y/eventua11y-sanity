import {defineType, defineField} from 'sanity'

export const event = defineType({
  title: 'Events',
  name: 'event',
  type: 'document',
  groups: [
    {name: 'details', title: 'Details', default: true},
    {name: 'relationships', title: 'Relationships'},
    {name: 'location', title: 'Location'},
    {name: 'dates', title: 'Dates'},
    {name: 'callForSpeakers', title: 'Call for Speakers'},
  ],
  fields: [
    // --- Details group ---
    defineField({
      title: 'Title',
      name: 'title',
      type: 'string',
      group: 'details',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      title: 'Description',
      name: 'description',
      type: 'text',
      group: 'details',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      title: 'Type',
      name: 'type',
      type: 'string',
      group: 'details',
      initialValue: 'normal',
      options: {
        list: [
          {title: 'Normal', value: 'normal'},
          {title: 'Theme', value: 'theme'},
        ],
        layout: 'radio',
      },
    }),
    defineField({
      title: 'Format',
      name: 'format',
      type: 'string',
      group: 'details',
      hidden: ({document}) => document?.type === 'theme',
      options: {
        list: [
          {title: 'Talk', value: 'talk'},
          {title: 'Workshop', value: 'workshop'},
          {title: 'Tutorial', value: 'tutorial'},
          {title: 'Roundtable', value: 'roundtable'},
          {title: 'Competition', value: 'competition'},
          {title: 'Panel', value: 'panel'},
          {title: 'Interview', value: 'interview'},
          {title: 'Demo', value: 'demo'},
          {title: 'Keynote', value: 'keynote'},
          {title: 'Announcement', value: 'announcement'},
          {title: 'Other', value: 'other'},
        ],
      },
    }),
    defineField({
      title: 'Free of charge',
      name: 'isFree',
      type: 'boolean',
      group: 'details',
      initialValue: false,
    }),
    defineField({
      title: 'Website',
      name: 'website',
      type: 'url',
      group: 'details',
    }),

    // --- Relationships group ---
    defineField({
      title: 'This is a parent event',
      name: 'isParent',
      type: 'boolean',
      group: 'relationships',
      initialValue: false,
      description: 'Will this event have sub-events?',
      hidden: ({document}) => document?.type === 'theme',
    }),
    defineField({
      title: 'Part of',
      name: 'parent',
      type: 'reference',
      to: [{type: 'event'}],
      group: 'relationships',
      description: 'If this is part of a larger event, select it here.',
      hidden: ({document}) => document?.type === 'theme' || document?.isParent === true,
    }),
    defineField({
      title: 'Speakers',
      name: 'speakers',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{type: 'person'}],
        },
      ],
      group: 'relationships',
      description: 'Add one or more speakers for this event',
      hidden: ({document}) => document?.type === 'theme',
    }),

    // --- Location group ---
    defineField({
      title: 'Attendance Mode',
      name: 'attendanceMode',
      type: 'string',
      group: 'location',
      validation: (Rule) => Rule.required(),
      initialValue: 'none',
      options: {
        list: [
          {title: 'Online', value: 'online'},
          {title: 'Offline', value: 'offline'},
          {title: 'Mixed', value: 'mixed'},
          {title: 'None', value: 'none'},
        ],
        layout: 'radio',
      },
      hidden: ({document}) => document?.type === 'theme',
    }),
    defineField({
      title: 'Location',
      name: 'location',
      type: 'string',
      group: 'location',
      hidden: ({document}) => document?.type === 'theme' || document?.attendanceMode === 'online',
    }),
    defineField({
      title: 'Geo location',
      name: 'geopoint',
      type: 'geopoint',
      group: 'location',
      hidden: ({document}) =>
        document?.type === 'theme' ||
        document?.attendanceMode === 'online' ||
        document?.attendanceMode === 'none',
    }),

    // --- Dates group ---
    defineField({
      title: 'Scheduled',
      name: 'scheduled',
      type: 'boolean',
      group: 'dates',
      initialValue: true,
      hidden: ({document}) => !document?.parent || document?.type === 'theme',
    }),
    defineField({
      title: 'Starts',
      name: 'dateStart',
      type: 'datetime',
      group: 'dates',
      options: {
        allowTimeZoneSwitch: true,
      },
      hidden: ({document}) => document?.scheduled === false,
      validation: (Rule) =>
        Rule.custom((value, context) => {
          const doc = context.document
          // Required when the event is scheduled (scheduled defaults to true)
          if (doc?.scheduled !== false && !value) {
            return 'A start date is required for scheduled events'
          }
          return true
        }),
    }),
    defineField({
      title: 'Ends',
      name: 'dateEnd',
      type: 'datetime',
      group: 'dates',
      options: {
        allowTimeZoneSwitch: true,
      },
      hidden: ({document}) => document?.scheduled === false,
      validation: (Rule) =>
        Rule.custom((value, context) => {
          const doc = context.document
          if (value && doc?.dateStart && new Date(value) <= new Date(doc.dateStart)) {
            return 'End date must be after the start date'
          }
          return true
        }),
    }),
    defineField({
      title: 'Timezone',
      name: 'timezone',
      type: 'string',
      group: 'dates',
      description:
        "Must be IANA timezone name (e.g., 'America/New_York', 'Europe/London', 'Asia/Tokyo', 'Australia/Sydney', 'Europe/Berlin', 'Asia/Dubai', 'America/Los_Angeles', 'Europe/Moscow', 'Asia/Kolkata', 'America/New_York', 'America/Los_Angeles'). Cannot use abbreviations (EST, PST, etc.)",
      hidden: ({document}) => document?.scheduled === false,
    }),
    defineField({
      title: 'All day',
      name: 'day',
      type: 'boolean',
      group: 'dates',
      initialValue: false,
      hidden: ({document}) => document?.scheduled === false,
    }),

    // --- Call for Speakers group ---
    defineField({
      title: 'Call for speakers',
      name: 'callForSpeakers',
      type: 'boolean',
      group: 'callForSpeakers',
      initialValue: false,
      hidden: ({document}) => document?.type === 'theme',
    }),
    defineField({
      title: 'Call for speakers closing date',
      name: 'callForSpeakersClosingDate',
      type: 'datetime',
      group: 'callForSpeakers',
      options: {
        allowTimeZoneSwitch: true,
      },
      hidden: ({document}) => document?.callForSpeakers === false,
    }),
  ],
  orderings: [
    {
      title: 'Chronological',
      name: 'dateStartAsc',
      by: [{field: 'dateStart', direction: 'asc'}],
    },
    {
      title: 'Reverse Chronological',
      name: 'dateStartDesc',
      by: [{field: 'dateStart', direction: 'desc'}],
    },
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'dateStart',
    },
  },
})

export default event
