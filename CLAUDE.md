# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Sanity Studio instance for Eventua11y, managing content for the eventua11y.com website. It's a headless CMS built with Sanity v3 that handles accessibility-focused event data.

## Common Commands

### Development
- `npm run dev` - Start development server
- `npm run start` - Start production server  
- `npm run build` - Build the studio
- `npm run deploy` - Deploy to Sanity hosting
- `npm run deploy-graphql` - Deploy GraphQL schema

### Code Quality
- Prettier is configured with: semi: false, printWidth: 100, bracketSpacing: false, singleQuote: true
- ESLint uses @sanity/eslint-config-studio v5.0.2

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
- `sanity-plugin-country-state-select` - Location selection
- `sanity-plugin-recurring-dates` - Recurring event dates
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

### Content Relationships
- Events can reference speakers (person type)
- Events can have parent-child relationships
- Cross-dataset duplication for events between environments