# Style guide

Conventions for written content in this project — primarily Sanity content (topic descriptions, event descriptions, etc.) but also documentation and UI strings.

## Language and spelling

- **Oxford English** (British spelling with `-ize` endings).
  - Use: `colour`, `behaviour`, `centre`, `programme`, `recognise`… **but** `organize`, `organization`, `realize`, `analyse` → `analyze`, `criticize`.
  - When in doubt: matches the *Oxford English Dictionary* / Oxford University Press house style. This is the standard for international English (i18n-friendly) used by the UN, WHO, and most international bodies.
- Single spaces after full stops.
- Curly quotes (`’`, `“ ”`) and proper en/em dashes (`–`, `—`), not straight quotes or double-hyphens.

## Voice and tone

- Third person, present tense, plain language.
- No "we" or "you". No marketing tone, no hype, no exclamation marks.
- Short sentences. Prefer concrete nouns and active verbs.

## Terminology — disability and accessibility

- **Identity-first language by default** ("disabled people", "Deaf people", "autistic people"). This matches UK convention and most disability rights communities.
- **Follow each community’s own preference** where it differs:
  - Down syndrome community → person-first: "people with Down syndrome".
  - Some individuals prefer person-first; respect direct quotes and self-identification.
- **Capitalise** community/identity terms as the community does: Deaf, Down syndrome, Dyslexia, ADHD, Autistic.
- **Avoid**:
  - Euphemisms: *differently abled*, *special needs*, *handicapped*, *suffers from*, *wheelchair-bound*, *the disabled*.
  - Medical-deficit framing where the social model fits ("people with disabilities are excluded by inaccessible design", not "disabilities prevent people from using the web").
  - "Normal" as a contrast to disabled.

## Acronyms and technical terms

- Well-known acronyms can stand alone: HTML, CSS, ARIA, AI, UX, WCAG, EAA, GAAD, CMS, API.
- Spell out lesser-known ones on first use: *Repetitive Strain Injury (RSI)*, *Colour Vision Deficiency (CVD)*.
- Don’t over-explain in short fields like topic descriptions — link out from longer body content instead.

## Topic descriptions specifically

- **Length**: 1–2 sentences, roughly 120–200 characters.
- **Purpose**: a short plain-text summary used in listings and metadata. Should answer "what is this topic about?" in one glance.
- **Form**: complete sentence(s), not noun phrases or fragments.
- **Frame**: describe what the topic *is* and why it matters in a digital accessibility / web context.
- **Don’t**:
  - Reference specific events, conferences, awareness days, or organisations.
  - Repeat the topic name verbatim as the opening words.
  - Use first or second person.
  - Promise or recommend ("you should…", "the best way to…").
- **Do**:
  - Lead with the subject in plain terms.
  - Mention the accessibility relevance if it isn’t obvious from the topic name.
  - Use the community’s preferred terminology (see above).

### Example

> **Topic**: Braille
>
> ✅ A tactile writing system used by many blind and partially sighted people, encoding letters, numbers, and punctuation as raised dot patterns. Relevant to refreshable braille displays, signage, and document accessibility.
>
> ❌ World Braille Day is celebrated each year on 4 January — learn about braille at this annual event! *(References a specific day; uses second-person tone; doesn’t define the topic.)*

## Event descriptions

- One short paragraph (roughly 1–4 sentences).
- Lead with what the event is and what attendees will get out of it.
- Factual, not promotional. Mirror the organiser’s framing where reasonable but trim hype.
- Specific dates, locations, and times belong in their own fields, not the description.

## Punctuation conventions

- Oxford comma: **use it**.
- Lists in prose: serial commas, no semicolons unless items contain commas.
- Hyphenate compound modifiers before nouns: *web-based service*, *plain-text summary*. Don’t hyphenate after the noun: *the service is web based*.
- Use en dashes (`–`) for ranges (*2024–2025*) and em dashes (`—`) for parenthetical breaks, with no surrounding spaces in the en dash and surrounding spaces optional but consistent for the em dash (this guide uses no spaces around em dashes).

## Numbers, dates, units

- Spell out one to nine; use digits for 10 and above. Exception: always digits for ages, percentages, measurements, and version numbers.
- Dates in prose: *4 January 2026*. ISO format (`2026-01-04`) in data and code.
- Use `%` with digits (*15%*), not "fifteen percent".

## When in doubt

1. Check existing published content in this dataset for precedent.
2. Default to the most accessible, least jargon-heavy phrasing.
3. Ask the maintainer rather than guess on community-sensitive terminology.
