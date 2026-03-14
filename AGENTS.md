# Dunn-Keaney Website

This file captures the current project state so a new thread can continue without rebuilding context.

## Project Purpose

This is a personal/family website for `dunnkeaney.com`.

Current goals are:

- Wedding soft launch with a polished public-facing RSVP flow
- Long-lived household homepage and newsletter archive
- Personal sections for Kaleb and James
- Static-first architecture with low maintenance

The intended tone is calm, archival, restrained, and typography-led.

## Stack

- Astro 5
- Netlify adapter
- Tailwind CSS 4
- React is installed for legacy starter/demo components, but the main site is Astro-first

Important config:

- [`astro.config.mjs`](/C:/Users/Kaleb/Documents/projects/DunnKeaney%20Website/DunnKeaney-Website/astro.config.mjs)
- [`package.json`](/C:/Users/Kaleb/Documents/projects/DunnKeaney%20Website/DunnKeaney-Website/package.json)

## Current Routes

Primary site routes:

- `/`
- `/newsletter`
- `/newsletter/[slug]`
- `/wedding`
- `/rsvp`
- `/rsvp/thanks`
- `/kaleb`
- `/kaleb/resume`
- `/james`

There are still starter/demo routes present and deployable:

- `/blobs`
- `/edge`
- `/image-cdn`
- `/revalidation`

They are no longer in primary navigation, but they still exist in `src/pages`. If preparing for production cleanup, these should be reviewed and likely removed.

## Navigation

Current header order:

- `Home`
- `Newsletter`
- `Wedding`
- visual divider `|`
- `Kaleb`
- `James`

Wedding is a dropdown with:

- `Details`
- `RSVP`

Relevant file:

- [`src/components/Header.astro`](/C:/Users/Kaleb/Documents/projects/DunnKeaney%20Website/DunnKeaney-Website/src/components/Header.astro)

## Homepage

Current homepage structure:

- Lead text
- Large cropped household image
- Two-column lower section:
  - `Purpose`
  - `Current Sections`

Relevant files:

- [`src/pages/index.astro`](/C:/Users/Kaleb/Documents/projects/DunnKeaney%20Website/DunnKeaney-Website/src/pages/index.astro)
- [`src/styles/globals.css`](/C:/Users/Kaleb/Documents/projects/DunnKeaney%20Website/DunnKeaney-Website/src/styles/globals.css)

Homepage image asset:

- [`public/images/home-portrait-wide.jpg`](/C:/Users/Kaleb/Documents/projects/DunnKeaney%20Website/DunnKeaney-Website/public/images/home-portrait-wide.jpg)

Current homepage lead copy:

- Heading: `Welcome to the digital threshold of the Dunn-Keaney household.`
- Body: `This site holds announcements, letters, and selected personal work from James and Kaleb, alongside a small amount of professional information and wedding details.`

This copy may still evolve.

## Wedding Page

Current wedding page includes:

- Title and intro
- Two-column layout with portrait on one side and event details on the other
- RSVP CTA integrated into the details panel

Relevant file:

- [`src/pages/wedding.astro`](/C:/Users/Kaleb/Documents/projects/DunnKeaney%20Website/DunnKeaney-Website/src/pages/wedding.astro)

Wedding data currently in file:

- Couple: `Kaleb Dunn and James Keaney`
- Date: `Sunday, September 6th, 2026`
- Time: `4:00 PM`
- Venue: `Melwood Arts Center`
- Location: `Louisville, Kentucky`
- Dress code: `Cocktail attire`

Wedding portrait asset:

- [`public/images/wedding-portrait.jpg`](/C:/Users/Kaleb/Documents/projects/DunnKeaney%20Website/DunnKeaney-Website/public/images/wedding-portrait.jpg)

## RSVP

The RSVP flow is custom and server-backed.

User flow:

1. User enters full name on `/rsvp`
2. `GET /api/rsvp-lookup` checks the Google Sheets whitelist
3. If found and not already responded, form step 2 is shown
4. `POST /api/rsvp-submit` writes the response to Google Sheets and marks the household as responded

Design intent:

- One response per household
- Name lookup isolated from submission to reduce frustration from typos
- Household grouping handled on the backend, not in visible UX

Relevant files:

- [`src/pages/rsvp.astro`](/C:/Users/Kaleb/Documents/projects/DunnKeaney%20Website/DunnKeaney-Website/src/pages/rsvp.astro)
- [`src/pages/api/rsvp-lookup.ts`](/C:/Users/Kaleb/Documents/projects/DunnKeaney%20Website/DunnKeaney-Website/src/pages/api/rsvp-lookup.ts)
- [`src/pages/api/rsvp-submit.ts`](/C:/Users/Kaleb/Documents/projects/DunnKeaney%20Website/DunnKeaney-Website/src/pages/api/rsvp-submit.ts)
- [`src/utils/rsvpSheets.ts`](/C:/Users/Kaleb/Documents/projects/DunnKeaney%20Website/DunnKeaney-Website/src/utils/rsvpSheets.ts)
- [`docs/rsvp-google-sheets.md`](/C:/Users/Kaleb/Documents/projects/DunnKeaney%20Website/DunnKeaney-Website/docs/rsvp-google-sheets.md)

### Google Sheets Whitelist Model

Current `whitelist` sheet columns:

- `household_key`
- `primary_contact`
- `max_attendees`
- `alias_1`
- `alias_2`
- `responded`
- `notes`

Lookup rules:

- `fullName` is normalized to a slug-like key
- matched against `household_key`, `alias_1`, or `alias_2`

Current `responses` sheet writes:

- timestamp
- household key
- primary contact
- submitted by
- attendance
- attending count
- notes
- user agent

### Required Env Vars

- `GOOGLE_SERVICE_ACCOUNT_EMAIL`
- `GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY`
- `GOOGLE_SHEET_ID`
- optional: `GOOGLE_SHEET_WHITELIST_RANGE`
- optional: `GOOGLE_SHEET_RESPONSES_RANGE`

## Newsletter

Newsletter is implemented with Astro content collections.

Relevant files:

- [`src/content.config.ts`](/C:/Users/Kaleb/Documents/projects/DunnKeaney%20Website/DunnKeaney-Website/src/content.config.ts)
- [`src/pages/newsletter/index.astro`](/C:/Users/Kaleb/Documents/projects/DunnKeaney%20Website/DunnKeaney-Website/src/pages/newsletter/index.astro)
- [`src/pages/newsletter/[slug].astro`](/C:/Users/Kaleb/Documents/projects/DunnKeaney%20Website/DunnKeaney-Website/src/pages/newsletter/%5Bslug%5D.astro)

Current sample content:

- [`src/content/newsletter/2026-03-family-letter.md`](/C:/Users/Kaleb/Documents/projects/DunnKeaney%20Website/DunnKeaney-Website/src/content/newsletter/2026-03-family-letter.md)

## Kaleb Section

Current pages:

- [`src/pages/kaleb/index.astro`](/C:/Users/Kaleb/Documents/projects/DunnKeaney%20Website/DunnKeaney-Website/src/pages/kaleb/index.astro)
- [`src/pages/kaleb/resume.astro`](/C:/Users/Kaleb/Documents/projects/DunnKeaney%20Website/DunnKeaney-Website/src/pages/kaleb/resume.astro)

Resume content was populated from the `.docx` version of Kaleb's resume, not the PDF.

Temporary extraction files exist in repo root:

- `resume_docx_extract.txt`
- `resume_extract.txt`

These are not part of the site and can likely be deleted later.

## James Section

Current state:

- Placeholder only
- File: [`src/pages/james/index.astro`](/C:/Users/Kaleb/Documents/projects/DunnKeaney%20Website/DunnKeaney-Website/src/pages/james/index.astro)

## Sitewide Visual System

Defined in:

- [`src/styles/globals.css`](/C:/Users/Kaleb/Documents/projects/DunnKeaney%20Website/DunnKeaney-Website/src/styles/globals.css)

Current palette:

- cream background `#F6F1E7`
- green `#1F3A32`
- blue-black `#2C3340`
- burgundy accent `#5A1F2B`

Typography:

- serif: `Iowan Old Style` fallback chain
- sans: `Inter Variable`

There is a subtle noise background used sitewide.

## Footer Mascot

There is currently a small dog-eyes image in the footer, intended as a subtle recurring mark.

Relevant files:

- [`src/components/Footer.astro`](/C:/Users/Kaleb/Documents/projects/DunnKeaney%20Website/DunnKeaney-Website/src/components/Footer.astro)
- [`public/images/dog-eyes-footer.jpg`](/C:/Users/Kaleb/Documents/projects/DunnKeaney%20Website/DunnKeaney-Website/public/images/dog-eyes-footer.jpg)

This was a deliberate stylistic choice requested by the user.

## Operational Notes

### TLS / phone-only domain issues

There was a reported issue where desktop web worked but phone showed TLS/domain errors after deploy.

Most likely causes discussed:

- DNS cache mismatch between devices
- `www` vs apex mismatch
- certificate propagation edge state
- IPv6 / AAAA resolution difference
- Private Relay / mobile DNS behavior

This was not resolved inside the repo. It is likely a Netlify/domain/DNS issue rather than app code.

### Build Status

Repeatedly verified with:

```powershell
$env:ASTRO_TELEMETRY_DISABLED='1'; npm run build
```

Build was passing at the end of this thread.

## Cleanup Candidates

These are known cleanup items, not necessarily urgent:

- Remove starter/demo pages if they are no longer wanted
- Remove temporary resume extraction files from repo root
- Remove `.vendor` remnants if they still appear in git status
- Decide whether homepage copy needs another pass
- Decide whether footer mascot stays permanently

## Current User Preferences Observed

- Prefers calmer, less redundant homepage language
- Prefers navigation with wedding grouped under dropdown and personal sections separated
- Strong visual opinions on image crop quality
- Wants the site to feel more like a household archive than a link hub
- Likes playful but restrained details when they feel intentional

## Resume of Recent Image Decisions

- Homepage image should exclude the dog and include both full heads
- Wedding page image can include the dog
- Footer uses a tight dog-eyes crop
- User may continue iterating image crops manually in `Downloads` and ask to swap them in

