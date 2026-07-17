# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Sanity Studio instance for Eventua11y, managing content for the eventua11y.com website. It's a headless CMS built with Sanity v4 that handles accessibility-focused event data.

## Common Commands

### Development
- `npm run dev` - Start development server
- `npm run start` - Start production server  
- `npm run build` - Build the studio
- `npm run deploy` - Deploy the full Studio (build + push hosted Studio app)
- `npm run deploy-schema` - Deploy only the schema (validation rules, field definitions) without rebuilding the Studio
- `npm run deploy-graphql` - Deploy GraphQL schema

### Code Quality
- Prettier is configured with: semi: false, printWidth: 100, bracketSpacing: false, singleQuote: true
- ESLint uses @sanity/eslint-config-studio v5.0.2

## Schema Deployment

The schema is defined in source files under `/schemas/`. **Always deploy schema changes via the Sanity CLI** (`npm run deploy-schema`, i.e. `sanity schema deploy`), not via MCP tools.

The MCP `deploy_schema` tool is for MCP-managed workspaces. Using it on this project would adopt the legacy `system.schema` workspace into MCP management and cause the deployed schema to diverge from the source files in `/schemas/`. If that ever happens by accident, the next `sanity schema deploy` from source restores the canonical state.

Typical workflow for a schema change:
1. Edit the relevant file under `/schemas/`
2. `npm run build` to verify it compiles
3. Open a PR with the change
4. After merge, run `npm run deploy-schema` to push validation rules and field definitions to the live Studio
5. Run `npm run deploy` only if you also changed Studio configuration, structure, or plugins

## Architecture

### Multi-Environment Setup
The studio is configured for two environments in `sanity.config.js`:
- **Production** (`/production`): dataset 'production', project ID '2g5zqxo3'
- **Development** (`/test`): dataset 'test', project ID '2g5zqxo3'

### Schema Structure
Content types are defined in `/schemas/` and exported via `/schemas/index.js`:
- `event` - Core event schema with complex conditional fields
- `course` - Course/training content
- `provider` - Event providers/organizers
- `person` - Speaker profiles
- `collection` - Event collections
- `book` - Resource books

### Key Plugins
- `@sanity/cross-dataset-duplicator` - Event duplication between environments
- `@sanity/vision` - GROQ query testing
- `@sanity/google-maps-input` - Geographic data entry

### Event Schema Complexity
The event schema (`/schemas/event.js`) has sophisticated conditional logic:
- Parent/child event relationships
- Conditional field visibility based on event type
- Theme vs normal event types
- Attendance mode affects location field visibility
- Call for speakers with closing dates
- Scheduled vs unscheduled events
- Single-day events should NOT have an end date (dateEnd) set

### Event Data Guardrails
For non-theme scheduled events, make sure all of these are set before publishing:
- `slug` is set
- `organizer` is set
- `description` stays concise (short summary)
- `richDescription` contains the detailed event copy
- `codeOfConduct` is set when attendance mode is online, offline, or mixed
- `hashtags` use CasedLikeThis format and do not include `#`

### Content Relationships
- Events can reference speakers (person type)
- Events can have parent-child relationships
- Cross-dataset duplication for events between environments

## Recurring Theme Events

Theme events (type: "theme", attendanceMode: "none") are awareness days/weeks that recur annually. Create these for each new year.

### Fixed Date Events
| Event | Date |
|-------|------|
| World Braille Day | January 4 |
| Raynaud's Awareness Month | February 1-28 |
| Rheumatoid Arthritis Awareness Day | February 2 |
| World Hearing Day | March 3 |
| Dyscalculia Awareness Day | March 3 |
| World Down Syndrome Day | March 21 |
| World Parkinson's Day | April 11 |
| World Wide Web Day | August 1 |
| International Day of Sign Languages | September 23 |
| World Stroke Day | October 29 |
| Blue Beanie Day | November 30 |
| International Day of People with Disabilities | December 3 |

### Variable Date Events
| Event | Rule | Reference |
|-------|------|-----------|
| International Epilepsy Day | 2nd Monday of February | internationalepilepsyday.org |
| Repetitive Strain Injury Awareness Day | Last day of February | |
| Neurodiversity Celebration Week | Mid-March (varies yearly) | neurodiversityweek.com |
| Global Accessibility Awareness Day | 3rd Thursday of May | accessibility.day |
| World Sight Day | 2nd Thursday of October | iapb.org/world-sight-day |
| World Usability Day | 2nd Thursday of November | worldusabilityday.org |