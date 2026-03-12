# Google Sheets RSVP Setup

This RSVP flow uses two server routes:

- `GET /api/rsvp-lookup`
- `POST /api/rsvp-submit`

Both routes run on the server and access Google Sheets with a service account key from environment variables.

## 1) Create the Google Sheet

Create one spreadsheet with two tabs:

### `whitelist` tab

Row 1 headers:

- `household_key`
- `primary_contact`
- `max_attendees`
- `alias_1`
- `alias_2`
- `responded`
- `notes`

Example row:

- `john-doe`
- `John and Jane Doe`
- `2`
- `john-doe`
- `jane-doe`
- `FALSE`
- `Smith wedding side`

### `responses` tab

Row 1 headers:

- `timestamp_utc`
- `household_key`
- `primary_contact`
- `submitted_by`
- `attendance`
- `attending_count`
- `notes`
- `user_agent`

## 2) Create a service account

In Google Cloud:

1. Create/select a project.
2. Enable the Google Sheets API.
3. Create a service account.
4. Create a JSON key for that service account.

Share the spreadsheet with the service account email as `Editor`.

## 3) Configure environment variables

Set these in Netlify site settings (and locally in `.env` for dev):

- `GOOGLE_SERVICE_ACCOUNT_EMAIL`
- `GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY`
- `GOOGLE_SHEET_ID`
- `GOOGLE_SHEET_WHITELIST_RANGE` (optional, default: `whitelist!A2:G`)
- `GOOGLE_SHEET_RESPONSES_RANGE` (optional, default: `responses!A2:H`)

For the private key, preserve line breaks (or use `\n` escapes).

## 4) Test flow

1. Open `/rsvp`.
2. Use the first step lookup with a full name that matches `household_key`, `alias_1`, or `alias_2`.
3. Complete and submit RSVP.
4. Confirm:
   - new row is appended to `responses`
   - household `responded` cell in `whitelist` becomes `TRUE`
