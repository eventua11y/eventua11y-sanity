# Eventua11y Writing Style Guide

This guide covers how to write topic descriptions and event rich descriptions for Eventua11y. The audience is web practitioners: designers, developers, and people working in or adjacent to accessibility. Write for them as peers, not as students.

---

## Voice and tone

Write like a person talking to another practitioner. Direct, clear, no ceremony.

Not like this:
> Websites that work well for people with dyslexia publish content as real text rather than images of text, respect the user's browser settings for font, text size and line spacing, use short sentences and plain language, break long content into sections with clear headings, pair text with supporting icons or images where it helps, and offer search that handles misspellings and suggests alternatives.

Like this:
> Publish real text, not images of text. Respect users' browser settings for font and spacing. Break long content up with headings. And if someone misspells a search term, suggest what they probably meant.

The difference: contractions, short sentences, advice given directly rather than attributed to a hypothetical good website.

---

## Length

**Topic bodies:** aim for 100–130 words across three paragraphs.

**Event rich descriptions:** aim for 150–200 words across two to three paragraphs.

If you've hit the limit and something still needs saying, cut padding first. Phrases like "it is worth noting that", "in order to", and "as a result of this" are almost always removable.

---

## Sentence structure

- Short sentences. One idea per sentence where possible.
- Contractions are fine: it's, don't, that's, they're, you'll.
- Don't start every sentence the same way. Vary the rhythm.
- Avoid the word "utilize". Use "use".
- Avoid "leverage" as a verb.
- Avoid "impactful".

---

## What to avoid

**Em-dashes.** Don't use them. Use a comma, colon, semicolon, or a new sentence instead.

Wrong: `Voice biometrics — which aren't designed for atypical speech — can lock people out.`
Right: `Voice biometrics can lock out people with atypical speech. They're often not designed for it.`

**Run-on lists disguised as prose.** The third paragraph of a topic body is especially prone to this. Instead of listing every good practice in one sentence joined by commas, write 2–3 sentences of direct advice.

Wrong: `Websites that work well use short sentences, plain language, consistent navigation, clear error messages, enough time to complete tasks, a way to undo mistakes, and content that doesn't move without warning.`

Right: `Short sentences, plain language, and consistent navigation go a long way. Give people enough time, a way to undo mistakes, and content that doesn't move without warning.`

**Formal constructions.** "Presents very differently from person to person" → "It's not one thing." "Co-occurs with" → "often comes alongside" or "it's common alongside". "In contrast to" → "unlike". "Specific learning difficulty" → name the thing directly ("Dyslexia affects how people process written language"). "Neurodevelopmental condition" → drop the category and describe the effect.

**Puffery.** "Genuinely useful", "incredibly powerful", "best-in-class". Say what the thing does, not how impressive it is.

**Academic hedging.** "It could be argued that", "one might suggest", "it is important to note". Say the thing.

**Time-relative phrases.** Don't write "this year", "recently", or "in recent years". Content ages.

**"Websites that work well for X..."** This is fine once. Don't lead every third paragraph with it. Vary the construction or drop the framing and give the advice directly.

---

## Lists in prose

If you have more than three items, consider whether a bullet list is clearer. Inside Portable Text blocks, you can use a `bullet` style block. Don't force five items into a single sentence.

---

## Abbreviations

Expand every abbreviation at its first use in a piece of content. Format: full term first, abbreviation in parentheses. After that, use the abbreviation freely.

Right: `WCAG (Web Content Accessibility Guidelines) addresses this directly. WCAG is referenced in law…`
Wrong: `WCAG addresses this directly.` *(no expansion)*

This applies even when the abbreviation is the topic name. The ADHD topic still opens with "ADHD (attention deficit hyperactivity disorder)".

Common abbreviations used across topics and their expansions:

| Abbreviation | Full term |
|---|---|
| ADHD | attention deficit hyperactivity disorder |
| ARIA / WAI-ARIA | Web Accessibility Initiative — Accessible Rich Internet Applications |
| ATAG | Authoring Tool Accessibility Guidelines |
| ADA | Americans with Disabilities Act |
| CI | continuous integration |
| CMS | content management system |
| CSS | Cascading Style Sheets |
| DOM | Document Object Model |
| EAA | European Accessibility Act |
| HTML | HyperText Markup Language |
| ICT | information and communications technology |
| PEAT | Photosensitive Epilepsy Analysis Tool |
| RSI | repetitive strain injury |
| SVG | Scalable Vector Graphics |
| UI | user interface |
| UAAG | User Agent Accessibility Guidelines |
| W3C | World Wide Web Consortium |
| WCAG | Web Content Accessibility Guidelines |
| WHATWG | Web Hypertext Application Technology Working Group |

CSS, HTML, and similar abbreviations that are part of a topic name (e.g. "CSS & Accessibility", "HTML & Semantics") still need expanding at first use in the body text.

---

## Links

Link text should describe the target, not the action.

Wrong: `Click here to read the WCAG documentation.`
Right: `The [WCAG documentation](…) covers this in detail.`

Link text should be specific enough to make sense out of context. Screen reader users often navigate by links alone.

---

## Disability language

### Identity-first vs person-first

Follow community preference:

| Group | Preferred |
|---|---|
| Autistic people | Identity-first: "autistic person", not "person with autism" |
| Deaf people (culturally Deaf) | Identity-first: "Deaf person" |
| People with Down syndrome | Person-first: "person with Down syndrome" |
| Blind people | Either is used; identity-first is increasingly preferred |
| Disabled people generally | Either; follow the individual's lead if known |

When in doubt, use the language the community itself uses in its own publications.

### Don't do this

- Don't say "suffers from" or "is afflicted by". Say "has" or "is".
- Don't say "wheelchair-bound". Say "uses a wheelchair" or "wheelchair user".
- Don't say "the disabled" or "the blind". Say "disabled people" or "blind people".
- Don't frame disability as tragedy or inspiration. Neither is the point.
- Don't let one user story stand as representative of an entire community. Name it as one example.

---

## Factual claims

### Statistics

Only include figures you can link to a primary source. If the source is contested or hard to verify, drop the number and make the qualitative point instead.

Wrong: `Automated tools catch around 30% of accessibility issues.`
Right: `Automated tools catch a meaningful but limited proportion of issues.`

### User stories

The W3C's [Stories of Web Users](https://www.w3.org/WAI/people-use-web/user-stories/) are the primary source for user-facing examples. When citing them:

- Name the person and link to their story.
- State what they do, not what they "suffer from".
- Acknowledge the story is one example, not a summary of a community.

Don't conflate personas. Elias has memory loss but not dementia. Dhruv uses captions but his story isn't primarily about sign language advocacy. Stick to what the source actually says.

Don't mention the absence of a user story. If there's no W3C story for a topic, just don't reference one. The reader isn't expecting one for every topic, and calling out the gap draws attention to it unnecessarily.

### Technical claims

Check technical claims before including them. Things that are commonly cited but often inaccurate or contested:

- Market share figures for screen readers, CMSs, browsers
- Percentages of issues caught by automated tools
- Specific figures for what proportion of the population has a given condition

If you can't link to a primary source, make the qualitative version of the point.

---

## Topic description field

The `description` field is a one or two sentence summary shown in listings and previews. It should introduce what the topic is, not describe what the body covers or give design guidance.

Wrong: `Designing for people with cognitive and intellectual disabilities. Covers plain language, clear navigation, predictable interfaces, and reducing cognitive load.`
Right: `Designing for people with cognitive and intellectual disabilities, memory differences, and learning difficulties.`

Avoid clinical or diagnostic framing. Prefer plain, direct language over formal category terms:

- Not "a specific learning difficulty" — describe the effect instead: "Dyscalculia affects how people understand numbers..."
- Not "a neurodevelopmental condition" — describe the effect: "ADHD affects attention, impulse control, and executive function."
- Not "co-occurs with" — "it's common alongside"
- Not "umbrella term" — just name what it includes: "Dementia affects memory, language, attention, and reasoning. It includes conditions like Alzheimer's and vascular dementia."

Descriptions don't need abbreviation expansion (the `body` does). Contractions are fine.

---

## Topic body structure

Three paragraphs, 100–130 words total:

1. **What it is.** Plain definition. Key facts. No hedging. (~30–40 words)
2. **A real example.** Usually a W3C user story. What the person does, what gets in their way. (~40–60 words)
3. **What to do.** Direct advice. 2–3 sentences, not a list. (~25–35 words)

---

## Event rich description structure

Two to three paragraphs, 150–200 words total:

1. **What the event marks and why it matters.** Context, not preamble. (~50–70 words)
2. **A real example or connection.** W3C user story if relevant, or a named historical event/person. (~60–80 words)
3. **Optional: what this means for digital accessibility.** Only if there's something specific to say that isn't already covered in topics. (~30–50 words)

---

## Checklist before saving

- [ ] No em-dashes
- [ ] No run-on lists in the final paragraph
- [ ] Contractions used where natural
- [ ] All statistics linked to a primary source (or removed)
- [ ] Disability language follows community preference
- [ ] No one user story presented as representative of a whole community
- [ ] Under the word limit
- [ ] No time-relative phrases ("this year", "recently")
- [ ] Link text is descriptive
- [ ] Every abbreviation expanded at first use
