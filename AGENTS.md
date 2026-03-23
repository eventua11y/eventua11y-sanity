# Agent Team

## Overview

Agent team for eventua11y-sanity — a Sanity Studio v4 headless CMS managing accessibility-focused event data. There is no frontend in this repo; the project is schemas, configuration, and content management tooling.

The team is small (4 agents) to match the project's size (~28 files, ~1,280 lines of JavaScript). A full team is justified by two factors: zero existing test coverage (independent tester adds high value) and accessibility being the project's core mission (dedicated specialist).

## Agent Roster

| Role              | Model Tier | Instruction File                                     | Rationale                                                                                      |
| ----------------- | ---------- | ---------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| **Lead**          | Frontier   | [.agents/lead.md](.agents/lead.md)                   | Orchestrates work, makes architectural decisions, narrates delegations                         |
| **Coder**         | Mid-tier   | [.agents/coder.md](.agents/coder.md)                 | Implements schema changes, config, and features                                                |
| **Tester**        | Mid-tier   | [.agents/tester.md](.agents/tester.md)               | Writes tests independently from the Coder to avoid confirmation bias                           |
| **Accessibility** | Mid-tier   | [.agents/accessibility.md](.agents/accessibility.md) | Reviews content modelling for accessible data consumption (dual-touchpoint: planning + review) |

## Orchestration

```
User
  │
  ▼
Lead (frontier)
  ├──▶ Coder (mid-tier)     — schema changes, config, features, bug fixes
  ├──▶ Tester (mid-tier)    — test creation and execution (independent from Coder)
  └──▶ Accessibility (mid-tier) — advisory, called at planning and review stages
```

**Sequential workflow (typical):**

1. Lead receives task, gathers context
2. For accessibility-sensitive changes: Lead calls **Accessibility** for planning assessment
3. Lead delegates implementation to **Coder**
4. Lead calls **Tester** to verify (if test infrastructure exists)
5. For accessibility-sensitive changes: Lead calls **Accessibility** for review
6. Lead runs deterministic quality gates (`npm run build`, tests)
7. Lead reports results to user

**Quality gates (deterministic, run by Lead):**

- `npm run build` must succeed
- Tests must pass (when test infrastructure is set up)
- Prettier formatting must be consistent

## Cost Projection

| Agent         | Est. Call Volume | Tier     | Relative Cost |
| ------------- | ---------------- | -------- | ------------- |
| Lead          | ~10%             | Frontier | ~30% of spend |
| Coder         | ~45%             | Mid-tier | ~35% of spend |
| Tester        | ~30%             | Mid-tier | ~25% of spend |
| Accessibility | ~15%             | Mid-tier | ~10% of spend |

The Tester has higher call volume than typical because test infrastructure needs to be built from scratch. Once established, expect Tester volume to drop and Coder volume to increase proportionally.

## Escalation Map

```
Coder ──────▶ Lead    (architectural decisions, repeated build failures)
Tester ─────▶ Lead    (infra setup needs, discovered bugs)
Accessibility ▶ Lead  (issues requiring schema restructuring)
```

All escalation flows upward to the Lead. No lateral delegation between Coder, Tester, and Accessibility.
