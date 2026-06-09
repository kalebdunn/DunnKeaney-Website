# Dunn-Keaney Website

This file captures the current project state so a new thread can continue without rebuilding context.

## Project Purpose

This is a personal/family website for `dunnkeaney.com`.

Current goals are:

- Wedding soft launch with a polished public-facing RSVP flow
- Long-lived household homepage and newsletter archive
- Personal sections for Kaleb and James
- Static-first architecture with low maintenance

The intended tone is calm, archival, restrained, and typography-led. The site should feel like a household archive, not a generic link hub or marketing site.

## Stack

- Astro 5
- Netlify adapter
- Tailwind CSS 4
- Astro-first; React starter/demo components have been removed

Important config:

- [`astro.config.mjs`](/C:/Users/Kaleb/Documents/projects/DunnKeaney%20Website/DunnKeaney-Website/astro.config.mjs)
- [`package.json`](/C:/Users/Kaleb/Documents/projects/DunnKeaney%20Website/DunnKeaney-Website/package.json)

## Current Routes

Primary site routes:

- `/`
- `/newsletter`
- `/newsletter/[slug]`
- `/wedding`
- `/wedding/faq`
- `/rsvp`
- `/rsvp/thanks`
- `/kaleb`
- `/kaleb/resume`
- `/james`

Starter/demo routes have been removed:

- `/blobs`
- `/edge`
- `/image-cdn`
- `/revalidation`

Related demo APIs, demo helper components, demo images, React island code, and demo-only dependencies were also removed.

## Navigation And Brand

Current header order:

- Monogram home link
- `Home`
- `Newsletter`
- `Wedding`
- visual divider `|`
- `Kaleb`
- `James`

Wedding is a dropdown with:

- `Details`
- `FAQ`
- `RSVP`

Relevant files:

- [`src/components/Header.astro`](/C:/Users/Kaleb/Documents/projects/DunnKeaney%20Website/DunnKeaney-Website/src/components/Header.astro)
- [`src/components/Logo.astro`](/C:/Users/Kaleb/Documents/projects/DunnKeaney%20Website/DunnKeaney-Website/src/components/Logo.astro)
- [`src/styles/globals.css`](/C:/Users/Kaleb/Documents/projects/DunnKeaney%20Website/DunnKeaney-Website/src/styles/globals.css)

The text wordmark was replaced with a hand-drawn `DK` monogram SVG. The monogram uses a tightened viewBox and is bottom-aligned with the nav. Header bottom padding was reduced so the larger mark uses existing header space rather than pushing content down.

The favicon is also a monogram:

- [`public/favicon.svg`](/C:/Users/Kaleb/Documents/projects/DunnKeaney%20Website/DunnKeaney-Website/public/favicon.svg)
- [`public/robots.txt`](/C:/Users/Kaleb/Documents/projects/DunnKeaney%20Website/DunnKeaney-Website/public/robots.txt)
- [`public/sitemap.xml`](/C:/Users/Kaleb/Documents/projects/DunnKeaney%20Website/DunnKeaney-Website/public/sitemap.xml)

Favicon details:

- cream square background `#F6F1E7`
- blue-black monogram `#2C3340`
- favicon URL is cache-busted in `Layout.astro` with `?v=dk-monogram-4`
- favicon is deliberately simplified/heavier than the header mark for legibility at tab size

`Layout.astro` defines canonical URLs and Open Graph/Twitter preview metadata. Default preview image is the homepage portrait; wedding-related pages override the preview image with `public/images/wedding-portrait.jpg`.

Original user-provided source was `C:\Users\Kaleb\Downloads\DK Monogram v1.svg`.

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
- Event details panel
- Three CTA buttons: RSVP, FAQ, Registry

Relevant file:

- [`src/pages/wedding.astro`](/C:/Users/Kaleb/Documents/projects/DunnKeaney%20Website/DunnKeaney-Website/src/pages/wedding.astro)

Wedding data currently in file:

- Couple: `Kaleb Dunn and James Keaney`
- Date: `Sunday, September 6th, 2026`
- Time: `4:00 PM`
- Venue: `Mellwood Arts Center`
- Room: `Picasso Room`
- Address: `1860 Mellwood Ave, Louisville, KY 40206`
- Dress code: `Cocktail attire`
- RSVP deadline: `August 1, 2026`

Wedding CTA behavior:

- `Go to RSVP` uses burgundy accent
- `Read FAQ` uses green
- `Registry` uses navy / blue-black
- desktop layout uses equal negative space between button boxes
- mobile layout stacks buttons full-width

Registry:

- `https://www.crateandbarrel.com/gift-registry/james-keaney-and-kaleb-dunn/r7523524`

Wedding portrait asset:

- [`public/images/wedding-portrait.jpg`](/C:/Users/Kaleb/Documents/projects/DunnKeaney%20Website/DunnKeaney-Website/public/images/wedding-portrait.jpg)

## Wedding FAQ

FAQ is a standalone page:

- [`src/pages/wedding/faq.astro`](/C:/Users/Kaleb/Documents/projects/DunnKeaney%20Website/DunnKeaney-Website/src/pages/wedding/faq.astro)

Current FAQ topics:

- venue address
- Picasso Room location
- arrival time: `3:30 PM`
- free parking
- dinner and bar, no cocktail hour
- dietary restrictions should be noted on RSVP
- children are invited and should be included in attendee count
- plus-ones are limited to the RSVP attendee count
- cocktail attire, no jeans or polos
- jewel tone wedding colors
- indoors
- RSVP deadline
- changing an RSVP by contacting Kaleb or James
- Crate & Barrel registry
- general questions by contacting Kaleb or James

Items intentionally left off for now:

- event end time
- accessibility / entrances / elevators
- hotel block or lodging recommendations
- travel / airport guidance
- ceremony photography policy
- after-party or next-day brunch
- explicit public contact info

## RSVP

The RSVP flow is custom and server-backed.

User flow:

1. User enters `Name` on `/rsvp`
2. `GET /api/rsvp-lookup` checks the Google Sheets whitelist
3. If found and not already responded, form step 2 is shown
4. User submits one response for the household
5. `POST /api/rsvp-submit` writes the response to Google Sheets and marks the household as responded
6. User is redirected to `/rsvp/thanks`

Design intent:

- One response per household
- Name lookup isolated from submission to reduce frustration from typos
- Household grouping handled on the backend and shown through attendee count
- RSVP copy avoids implying every invitation was individually addressed
- Errors direct guests to contact Kaleb or James, without publishing contact info

Relevant files:

- [`src/pages/rsvp.astro`](/C:/Users/Kaleb/Documents/projects/DunnKeaney%20Website/DunnKeaney-Website/src/pages/rsvp.astro)
- [`src/pages/rsvp/thanks.astro`](/C:/Users/Kaleb/Documents/projects/DunnKeaney%20Website/DunnKeaney-Website/src/pages/rsvp/thanks.astro)
- [`src/pages/api/rsvp-lookup.ts`](/C:/Users/Kaleb/Documents/projects/DunnKeaney%20Website/DunnKeaney-Website/src/pages/api/rsvp-lookup.ts)
- [`src/pages/api/rsvp-submit.ts`](/C:/Users/Kaleb/Documents/projects/DunnKeaney%20Website/DunnKeaney-Website/src/pages/api/rsvp-submit.ts)
- [`src/utils/rsvpSheets.ts`](/C:/Users/Kaleb/Documents/projects/DunnKeaney%20Website/DunnKeaney-Website/src/utils/rsvpSheets.ts)
- [`docs/rsvp-google-sheets.md`](/C:/Users/Kaleb/Documents/projects/DunnKeaney%20Website/DunnKeaney-Website/docs/rsvp-google-sheets.md)

Current `/rsvp` intro:

- `Step 1: Confirm your invitation by name. Step 2: Submit one response for your household.`
- `Please RSVP by August 1, 2026.`

Current RSVP form details:

- first field label is `Name`
- no helper text telling guests to use invitation-addressed names
- attendance options are `Joyfully accepts` and `Regretfully declines`
- `Number Attending` is a number input
- after lookup, max is set to the household max attendee count
- after lookup, value defaults to `maxAttendees`
- helper text says to include everyone in the household or family unit, including children
- notes field label is `Notes or Dietary Needs (Optional)`
- thank-you page says to contact Kaleb or James for later changes

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

Local `.env` exists and is gitignored. Production env vars live in Netlify.

## Newsletter

Newsletter is implemented with Astro content collections.

Relevant files:

- [`src/content.config.ts`](/C:/Users/Kaleb/Documents/projects/DunnKeaney%20Website/DunnKeaney-Website/src/content.config.ts)
- [`src/pages/newsletter/index.astro`](/C:/Users/Kaleb/Documents/projects/DunnKeaney%20Website/DunnKeaney-Website/src/pages/newsletter/index.astro)
- [`src/pages/newsletter/[slug].astro`](/C:/Users/Kaleb/Documents/projects/DunnKeaney%20Website/DunnKeaney-Website/src/pages/newsletter/%5Bslug%5D.astro)

Current sample content:

- [`src/content/newsletter/2026-03-family-letter.md`](/C:/Users/Kaleb/Documents/projects/DunnKeaney%20Website/DunnKeaney-Website/src/content/newsletter/2026-03-family-letter.md)

Newsletter page copy:

- Heading: `Family letters and updates`
- Intro: `An occasional archive of household news, reflections, and milestones.`

## Kaleb Section

Current pages:

- [`src/pages/kaleb/index.astro`](/C:/Users/Kaleb/Documents/projects/DunnKeaney%20Website/DunnKeaney-Website/src/pages/kaleb/index.astro)
- [`src/pages/kaleb/resume.astro`](/C:/Users/Kaleb/Documents/projects/DunnKeaney%20Website/DunnKeaney-Website/src/pages/kaleb/resume.astro)

Current Kaleb section includes:

- personal-section intro
- resume card linking to `/kaleb/resume`
- writing card marked `Coming soon`

Resume content was populated from the `.docx` version of Kaleb's resume, not the PDF.

Temporary extraction files may exist in repo root:

- `resume_docx_extract.txt`
- `resume_extract.txt`

These are not part of the site and can likely be deleted if still present.

## James Section

Current state:

- Placeholder only
- File: [`src/pages/james/index.astro`](/C:/Users/Kaleb/Documents/projects/DunnKeaney%20Website/DunnKeaney-Website/src/pages/james/index.astro)

Current copy says the section is reserved and will open as content is added.

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

UI style notes:

- square-edged buttons and panels
- restrained paper-panel surfaces
- no rounded marketing-card feel
- header brand uses the monogram, not text
- wedding CTAs intentionally use the three wedding colors

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

### RSVP Production Notes

Local RSVP lookup was verified successfully with `.env` loaded. Production RSVP initially returned `Lookup failed` before the latest Netlify env/deploy updates. If this recurs, check:

- Netlify production env var context
- deploy happened after env vars were added
- private key line breaks / `\n` escaping
- Google Sheet shared with service account as Editor

### Build Status

Repeatedly verified with:

```powershell
$env:ASTRO_TELEMETRY_DISABLED='1'; npm run build
```

Build was passing after the latest header/favicon changes.

Git status may require safe-directory configuration in sandboxed Codex because the repo is owned by the Windows user, not `CodexSandboxOffline`.

## Cleanup Candidates

Known cleanup items:

- Remove temporary resume extraction files from repo root if still present
- Keep `public/sitemap.xml` in sync as public routes are added or removed
- Consider dedicated social preview images if text-message/social sharing becomes important
- Revisit homepage copy once the wedding launch is stable
- Add actual content for James section
- Add writing or project content for Kaleb section
- Revisit FAQ items still intentionally deferred: hotels, accessibility, entrance/parking specifics, photo policy, wedding-weekend events

## Current User Preferences Observed

- Prefers calmer, less redundant homepage language
- Prefers navigation with wedding grouped under dropdown and personal sections separated
- Strong visual opinions on image crop quality
- Wants the site to feel more like a household archive than a link hub
- Likes playful but restrained details when they feel intentional
- Prefers public contact info not be posted for the wedding
- Prefers crisp typography and layout alignment over decorative excess
- Likes the DK monogram as a brand mark, but favicon needed simplification for legibility

## Resume of Recent Image And Brand Decisions

- Homepage image should exclude the dog and include both full heads
- Wedding page image can include the dog
- Footer uses a tight dog-eyes crop
- Header uses the original-style DK monogram
- Favicon uses a simplified, heavier DK monogram on cream
- User may continue iterating image crops manually in `Downloads` and ask to swap them in
