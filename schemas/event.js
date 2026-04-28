import {defineType, defineField} from 'sanity'

export const event = defineType({
  title: 'Events',
  name: 'event',
  type: 'document',
  groups: [
    {name: 'details', title: 'Details', default: true},
    {name: 'links', title: 'Links'},
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
      name: 'richDescription',
      type: 'array',
      title: 'Rich Description',
      group: 'details',
      description:
        'Optional rich text description for the event detail page. Supports links, bold, and italic.',
      of: [
        {
          type: 'block',
          styles: [{title: 'Normal', value: 'normal'}],
          lists: [],
          marks: {
            decorators: [
              {title: 'Strong', value: 'strong'},
              {title: 'Emphasis', value: 'em'},
            ],
            annotations: [
              {
                name: 'link',
                type: 'object',
                title: 'Link',
                fields: [
                  {
                    name: 'href',
                    type: 'url',
                    title: 'URL',
                    validation: (Rule) =>
                      Rule.uri({
                        allowCredentials: false,
                        allowRelative: true,
                        relativeOnly: false,
                        scheme: [/^http$/, /^https$/, /^mailto$/],
                      }),
                  },
                ],
              },
            ],
          },
        },
      ],
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
          {title: 'Hackathon', value: 'hackathon'},
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
      title: 'Slug',
      name: 'slug',
      type: 'slug',
      group: 'details',
      options: {
        source: 'title',
      },
    }),
    defineField({
      title: 'Event status',
      name: 'eventStatus',
      type: 'string',
      group: 'details',
      initialValue: 'scheduled',
      hidden: ({document}) => document?.type === 'theme',
      options: {
        list: [
          {title: 'Scheduled', value: 'scheduled'},
          {title: 'Cancelled', value: 'cancelled'},
          {title: 'Postponed', value: 'postponed'},
          {title: 'Rescheduled', value: 'rescheduled'},
        ],
        layout: 'radio',
      },
    }),
    defineField({
      title: 'Keywords',
      name: 'keywords',
      type: 'array',
      of: [{type: 'string'}],
      group: 'details',
      description: 'Tags or topics for this event (e.g. WCAG, screen readers, cognitive)',
      options: {
        layout: 'tags',
      },
    }),

    // --- Links group ---
    defineField({
      title: 'Website',
      name: 'website',
      type: 'url',
      group: 'links',
      description: "Link to the event's main website or homepage.",
      validation: (Rule) => Rule.uri({scheme: ['http', 'https'], allowRelative: false}),
    }),
    defineField({
      title: 'Registration URL',
      name: 'registration',
      type: 'url',
      group: 'links',
      description: 'Link to the event registration or ticket page.',
      validation: (Rule) => Rule.uri({scheme: ['http', 'https'], allowRelative: false}),
    }),
    defineField({
      title: 'Code of conduct URL',
      name: 'codeOfConduct',
      type: 'url',
      group: 'links',
      description: "Link to the event's published code of conduct.",
      validation: (Rule) => Rule.uri({scheme: ['http', 'https'], allowRelative: false}),
    }),
    defineField({
      title: 'Accessibility information',
      name: 'accessibilityInfo',
      type: 'object',
      group: 'links',
      description:
        "Link to a page describing the event's accessibility provisions — e.g. captioning, sign language interpretation, venue access, quiet rooms, dietary accommodations, content warnings, remote attendance options. Link to the most detailed page available; the event homepage is a poor fallback.",
      fields: [
        defineField({
          title: 'URL',
          name: 'url',
          type: 'url',
          validation: (Rule) => Rule.uri({scheme: ['http', 'https'], allowRelative: false}),
        }),
        defineField({
          title: 'Summary',
          name: 'summary',
          type: 'string',
          description:
            "Short plain-text summary of what's covered (e.g. 'Live captioning, step-free venue, quiet room'). Max 200 characters.",
          validation: (Rule) => Rule.max(200),
        }),
      ],
    }),
    defineField({
      title: 'Schedule URL',
      name: 'schedule',
      type: 'url',
      group: 'links',
      description:
        'Link to the event programme or agenda. If the schedule is embedded on the homepage, link to the anchor (e.g. …/event#schedule).',
      validation: (Rule) => Rule.uri({scheme: ['http', 'https'], allowRelative: false}),
    }),
    defineField({
      title: 'Call for speakers URL',
      name: 'callForSpeakersLink',
      type: 'url',
      group: 'links',
      description: 'Link to the open call for proposals. Leave blank once the CFP closes.',
      validation: (Rule) => Rule.uri({scheme: ['http', 'https'], allowRelative: false}),
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
    defineField({
      title: 'Organizer',
      name: 'organizer',
      type: 'reference',
      to: [{type: 'organizer'}],
      group: 'relationships',
    }),
    defineField({
      title: 'Topics',
      name: 'topics',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{type: 'topic'}],
        },
      ],
      group: 'relationships',
      description: 'Link to one or more topics related to this event',
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
      description:
        'For awareness/theme days, use the country name (e.g. "UK") if it is not international.',
      hidden: ({document}) => document?.type !== 'theme' && document?.attendanceMode === 'online',
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
      hidden: ({document}) => document?.callForSpeakers !== true,
    }),
  ],
  initialValue: {
    eventStatus: 'scheduled',
  },
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
