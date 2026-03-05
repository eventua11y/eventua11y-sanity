/**
 * Event Evaluation Skill
 *
 * Given the URL of an event website, fetches the page content and evaluates it
 * against the Eventua11y curation policy using Claude. Returns a recommendation
 * on whether the event should be listed, along with pre-populated field values.
 *
 * Usage:
 *   # Evaluate a URL directly (prints to stdout)
 *   ANTHROPIC_API_KEY=<key> node scripts/evaluate-event.mjs <url>
 *
 *   # Evaluate from a GitHub issue (reads URL, posts comment)
 *   ANTHROPIC_API_KEY=<key> GH_TOKEN=<token> node scripts/evaluate-event.mjs --issue <number>
 *
 * Environment:
 *   ANTHROPIC_API_KEY  Anthropic API key for Claude analysis (required)
 *   GH_TOKEN           GitHub token for reading/commenting on issues (required for --issue mode)
 *   GITHUB_REPOSITORY  Owner/repo (set automatically in GitHub Actions, defaults to eventua11y/eventua11y-sanity)
 */

const anthropicKey = process.env.ANTHROPIC_API_KEY
const repo = process.env.GITHUB_REPOSITORY || 'eventua11y/eventua11y-sanity'

// Parse arguments
const issueFlag = process.argv.indexOf('--issue')
const issueNumber = issueFlag !== -1 ? process.argv[issueFlag + 1] : null
const urlArg = issueFlag === -1 ? process.argv[2] : null

if (!urlArg && !issueNumber) {
  console.error('Usage:')
  console.error('  node scripts/evaluate-event.mjs <event-url>')
  console.error('  node scripts/evaluate-event.mjs --issue <number>')
  process.exit(1)
}

if (!anthropicKey) {
  console.error('Missing required environment variable: ANTHROPIC_API_KEY')
  process.exit(1)
}

// ---------------------------------------------------------------------------
// Curation policy (embedded so the script is self-contained)
// ---------------------------------------------------------------------------

const CURATION_POLICY = `
## Subject matter
Eventua11y lists events that focus on digital accessibility or inclusive design.
Broader conferences must include at least one substantive accessibility session.
Events may be listed before speakers are announced if at least one accessibility
session is expected, but will be removed if none is eventually confirmed.

### Overlay products
Eventua11y will not list events that deceptively market overlay solutions as
providing automated compliance with laws or standards.

## Language
Eventua11y currently only lists events that are delivered in English.

## Accessibility Policy
The event should have an Accessibility Policy that outlines the measures in
place to ensure an inclusive experience for all attendees, including information
about physical accessibility, digital accessibility, and available
accommodations such as sign language interpreters or captioning. The event's
official website must not have significant accessibility defects.

## Code of Conduct
The event should have a Code of Conduct explaining the expected standards of
behaviour for all participants, as well as the process for reporting and
addressing any incidents of harassment, discrimination, or other unacceptable
conduct.

## Representation
Organisers should strive to include a diverse range of speakers and
perspectives, ensuring representation from individuals with varied experience,
backgrounds, and expertise. This includes making a conscious effort to include
disabled people with lived experience of disability.

## Non-commercial focus
Events should prioritise learning and community building over aggressive sales
or promotions. Commercial organisers and sponsors are fine, but their
involvement should align with the event's mission to educate and support the
community.

## Meetups
Events in Eventua11y's main calendar are typically conferences that happen
annually. Smaller meetups that happen more regularly are not currently included.
`

// ---------------------------------------------------------------------------
// GitHub issue helpers
// ---------------------------------------------------------------------------

async function getIssueBody(number) {
  const {execSync} = await import('child_process')
  const body = execSync(`gh issue view ${number} --repo ${repo} --json body --jq .body`, {
    encoding: 'utf-8',
  }).trim()
  return body
}

function extractUrlFromIssueBody(body) {
  // The issue template puts the URL in a field labelled "Event website URL".
  // GitHub renders YAML form fields as "### Label\n\nValue" in the body.
  const urlPattern = /https?:\/\/[^\s)>\]]+/g
  const matches = body.match(urlPattern)
  if (!matches || matches.length === 0) {
    return null
  }
  return matches[0]
}

async function postIssueComment(number, comment) {
  const {execSync} = await import('child_process')
  const {writeFileSync, unlinkSync} = await import('fs')
  const {tmpdir} = await import('os')
  const {join} = await import('path')

  const tmpFile = join(tmpdir(), `evaluate-comment-${Date.now()}.md`)
  try {
    writeFileSync(tmpFile, comment, 'utf-8')
    execSync(`gh issue comment ${number} --repo ${repo} --body-file "${tmpFile}"`, {
      encoding: 'utf-8',
    })
  } finally {
    try {
      unlinkSync(tmpFile)
    } catch {
      // ignore cleanup errors
    }
  }
}

// ---------------------------------------------------------------------------
// Web fetching
// ---------------------------------------------------------------------------

async function fetchPage(targetUrl, timeoutMs = 20000) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)

  try {
    const response = await fetch(targetUrl, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Eventua11yEvaluator/1.0 (+https://eventua11y.com)',
        Accept: 'text/html,application/xhtml+xml',
      },
      redirect: 'follow',
    })

    if (!response.ok) {
      return {text: '', error: `HTTP ${response.status}`}
    }

    const contentType = response.headers.get('content-type') || ''
    if (!contentType.includes('text/html')) {
      return {text: '', error: `Not HTML (${contentType})`}
    }

    const text = await response.text()
    return {text, error: null}
  } catch (err) {
    return {
      text: '',
      error: err.name === 'AbortError' ? 'Timed out' : err.message,
    }
  } finally {
    clearTimeout(timer)
  }
}

function stripHtml(html, maxLength = 15000) {
  const text = html
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<nav[^>]*>[\s\S]*?<\/nav>/gi, '')
    .replace(/<footer[^>]*>[\s\S]*?<\/footer>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

  if (text.length > maxLength) {
    return text.substring(0, maxLength) + '\n[...truncated]'
  }
  return text
}

// ---------------------------------------------------------------------------
// Claude evaluation
// ---------------------------------------------------------------------------

async function evaluateWithClaude(pageText, eventUrl) {
  const prompt = `You are helping curate Eventua11y, a calendar of digital accessibility and inclusive design events. Given the text extracted from an event's official website, evaluate it against the curation policy and extract event details.

## Curation policy

${CURATION_POLICY}

## Text from the event website (${eventUrl})

${pageText}

## Your task

Do two things:

### 1. Evaluate the event against each curation criterion

For each criterion, give a verdict: "pass", "fail", "unclear", or "not applicable".
- "pass" = the website provides clear evidence the criterion is met.
- "fail" = the website provides clear evidence the criterion is NOT met.
- "unclear" = there is not enough information on the website to determine this. This is not a failure -- many events don't publish all policies on their main page.
- "not applicable" = the criterion does not apply (e.g. overlay products for a non-vendor event).

### 2. Extract event details

From the website text, extract as many of the following fields as possible. Use null for anything you cannot determine.

Respond with ONLY a JSON object (no markdown fences) in this exact format:
{
  "recommendation": "yes|no|maybe",
  "recommendationReason": "One or two sentences explaining the overall recommendation",
  "criteria": {
    "subjectMatter": {"verdict": "pass|fail|unclear", "reason": "One sentence"},
    "overlayProducts": {"verdict": "pass|fail|unclear|not applicable", "reason": "One sentence"},
    "language": {"verdict": "pass|fail|unclear", "reason": "One sentence"},
    "accessibilityPolicy": {"verdict": "pass|fail|unclear", "reason": "One sentence"},
    "codeOfConduct": {"verdict": "pass|fail|unclear", "reason": "One sentence"},
    "representation": {"verdict": "pass|fail|unclear", "reason": "One sentence"},
    "nonCommercialFocus": {"verdict": "pass|fail|unclear", "reason": "One sentence"},
    "meetups": {"verdict": "pass|fail|unclear|not applicable", "reason": "One sentence"}
  },
  "event": {
    "title": "Event title or null",
    "dateStart": "Start date as shown on the website (any format) or null",
    "dateEnd": "End date as shown on the website (any format) or null",
    "timezone": "IANA timezone identifier if determinable from location (e.g. 'America/New_York') or null",
    "location": "City, Country or venue name or null",
    "attendanceMode": "online|offline|mixed or null",
    "isFree": true/false/null,
    "website": "${eventUrl}",
    "type": "normal or theme",
    "callForSpeakers": true/false/null,
    "callForSpeakersClosingDate": "CFS deadline as shown on the website or null",
    "description": "A concise one-or-two-sentence description of the event suitable for a calendar listing, or null"
  }
}

Rules:
- "recommendation" should be "yes" if subjectMatter passes and there are no fails on other criteria. It should be "no" if subjectMatter fails or overlayProducts fails. It should be "maybe" if subjectMatter passes but other criteria are unclear.
- For the "type" field: use "theme" only for awareness days/weeks/months (e.g. Global Accessibility Awareness Day, Disability Pride Month). Everything else is "normal".
- For "attendanceMode": use "online" if virtual only, "offline" if in-person only, "mixed" if both options exist.
- For "timezone": infer from the event location if possible (e.g. London = Europe/London, New York = America/New_York). Leave null if the event is online-only with no stated timezone.
- Be factual. Only report what the website actually states.`

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': anthropicKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 2048,
      messages: [{role: 'user', content: prompt}],
    }),
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Claude API error (${response.status}): ${errorText}`)
  }

  const data = await response.json()
  const text = data.content?.[0]?.text || ''

  try {
    const cleaned = text
      .replace(/^```(?:json)?\s*/m, '')
      .replace(/\s*```\s*$/m, '')
      .trim()
    return JSON.parse(cleaned)
  } catch {
    throw new Error(`Could not parse Claude response as JSON: ${text.substring(0, 200)}`)
  }
}

// ---------------------------------------------------------------------------
// Output formatting (Markdown for GitHub comments, plain text for CLI)
// ---------------------------------------------------------------------------

const VERDICT_ICONS = {
  pass: 'PASS',
  fail: 'FAIL',
  unclear: '?',
  'not applicable': 'N/A',
}

const VERDICT_EMOJI = {
  pass: ':white_check_mark:',
  fail: ':x:',
  unclear: ':grey_question:',
  'not applicable': ':heavy_minus_sign:',
}

const CRITERIA_LABELS = {
  subjectMatter: 'Subject matter',
  overlayProducts: 'Overlay products',
  language: 'Language',
  accessibilityPolicy: 'Accessibility policy',
  codeOfConduct: 'Code of conduct',
  representation: 'Representation',
  nonCommercialFocus: 'Non-commercial focus',
  meetups: 'Not a meetup',
}

function formatMarkdown(result, eventUrl) {
  const lines = []

  const recEmoji =
    result.recommendation === 'yes'
      ? ':white_check_mark:'
      : result.recommendation === 'no'
        ? ':x:'
        : ':thinking:'
  const recLabel =
    result.recommendation === 'yes'
      ? 'Recommend listing'
      : result.recommendation === 'no'
        ? 'Do not list'
        : 'Needs manual review'

  lines.push(`## ${recEmoji} ${recLabel}`)
  lines.push('')
  lines.push(result.recommendationReason)
  lines.push('')

  // Criteria table
  lines.push('### Curation criteria')
  lines.push('')
  lines.push('| Criterion | Verdict | Detail |')
  lines.push('| --- | --- | --- |')

  for (const [key, label] of Object.entries(CRITERIA_LABELS)) {
    const c = result.criteria[key]
    if (!c) continue
    const emoji = VERDICT_EMOJI[c.verdict] || c.verdict
    lines.push(`| ${label} | ${emoji} ${c.verdict} | ${c.reason} |`)
  }

  lines.push('')

  // Extracted event details
  const e = result.event
  if (e) {
    lines.push('### Extracted event details')
    lines.push('')
    lines.push('| Field | Value |')
    lines.push('| --- | --- |')

    const fields = [
      ['Title', e.title],
      ['Dates', [e.dateStart, e.dateEnd].filter(Boolean).join(' -- ') || null],
      ['Timezone', e.timezone],
      ['Location', e.location],
      ['Attendance mode', e.attendanceMode],
      ['Free', e.isFree === true ? 'Yes' : e.isFree === false ? 'No' : null],
      ['Type', e.type],
      ['Website', e.website ? `[${e.website}](${e.website})` : null],
      ['CFS open', e.callForSpeakers === true ? 'Yes' : e.callForSpeakers === false ? 'No' : null],
      ['CFS deadline', e.callForSpeakersClosingDate],
      ['Description', e.description],
    ]

    for (const [label, value] of fields) {
      if (value != null) {
        lines.push(`| ${label} | ${value} |`)
      }
    }
  }

  lines.push('')
  lines.push(
    `<sub>Evaluated against the [curation policy](https://eventua11y.com/curation-policy). Source: ${eventUrl}</sub>`,
  )

  return lines.join('\n')
}

function formatPlainText(result) {
  const lines = []

  const recLabel =
    result.recommendation === 'yes'
      ? 'YES - Recommend listing'
      : result.recommendation === 'no'
        ? 'NO - Do not list'
        : 'MAYBE - Needs manual review'

  lines.push('')
  lines.push(`  Recommendation:  ${recLabel}`)
  lines.push(`  Reason:          ${result.recommendationReason}`)
  lines.push('')

  lines.push('  Criteria evaluation:')
  lines.push('  ' + '-'.repeat(70))

  for (const [key, label] of Object.entries(CRITERIA_LABELS)) {
    const c = result.criteria[key]
    if (!c) continue
    const icon = VERDICT_ICONS[c.verdict] || c.verdict
    lines.push(`  [${icon.padStart(4)}]  ${label.padEnd(24)} ${c.reason}`)
  }

  lines.push('  ' + '-'.repeat(70))
  lines.push('')

  const e = result.event
  if (e) {
    lines.push('  Extracted event details:')
    lines.push('')

    const fields = [
      ['Title', e.title],
      ['Dates', [e.dateStart, e.dateEnd].filter(Boolean).join(' -- ') || null],
      ['Timezone', e.timezone],
      ['Location', e.location],
      ['Attendance', e.attendanceMode],
      ['Free', e.isFree === true ? 'Yes' : e.isFree === false ? 'No' : null],
      ['Type', e.type],
      ['Website', e.website],
      ['CFS open', e.callForSpeakers === true ? 'Yes' : e.callForSpeakers === false ? 'No' : null],
      ['CFS deadline', e.callForSpeakersClosingDate],
      ['Description', e.description],
    ]

    for (const [label, value] of fields) {
      if (value != null) {
        lines.push(`  ${label.padEnd(14)} ${value}`)
      }
    }
  }

  lines.push('')
  return lines.join('\n')
}

// ---------------------------------------------------------------------------
// Core evaluation logic
// ---------------------------------------------------------------------------

async function evaluate(eventUrl) {
  const {text, error} = await fetchPage(eventUrl)
  if (error) {
    throw new Error(`Could not fetch page: ${error}`)
  }

  const plainText = stripHtml(text)
  if (plainText.length < 100) {
    throw new Error('Page has very little content. Cannot evaluate.')
  }

  return evaluateWithClaude(plainText, eventUrl)
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  if (issueNumber) {
    // --- Issue mode: read URL from issue, post comment ---
    console.log(`Reading issue #${issueNumber}...`)

    const body = await getIssueBody(issueNumber)
    const eventUrl = extractUrlFromIssueBody(body)

    if (!eventUrl) {
      const errorComment =
        'Could not find a valid URL in this issue. Please make sure the event website URL field is filled in.'
      await postIssueComment(issueNumber, errorComment)
      console.error('No URL found in issue body.')
      process.exit(1)
    }

    console.log(`Found URL: ${eventUrl}`)
    console.log('Evaluating against curation policy...')

    try {
      const result = await evaluate(eventUrl)
      const comment = formatMarkdown(result, eventUrl)
      await postIssueComment(issueNumber, comment)
      console.log(`Comment posted on issue #${issueNumber}`)
    } catch (err) {
      const errorComment = `Evaluation failed: ${err.message}`
      await postIssueComment(issueNumber, errorComment)
      console.error(err.message)
      process.exit(1)
    }
  } else {
    // --- CLI mode: evaluate URL, print to stdout ---
    try {
      new URL(urlArg)
    } catch {
      console.error(`Invalid URL: ${urlArg}`)
      process.exit(1)
    }

    console.log(`\nFetching ${urlArg}...`)
    console.log('Evaluating against curation policy...\n')

    const result = await evaluate(urlArg)
    console.log(formatPlainText(result))
  }
}

main().catch((err) => {
  console.error('Fatal error:', err)
  process.exit(1)
})
