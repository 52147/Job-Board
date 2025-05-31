# Job Board (Google Sheets Powered)

This is an interactive job board application that pulls job listings directly from a Google Sheet using Google Sheets API. Built with Next.js and Tailwind CSS, this site allows non-technical users to update listings in real-time simply by editing a spreadsheet.

## Features

* Real-time updates from a connected Google Sheet
* Jobs grouped by location for easy browsing
* Search and filter by title, skills, location, and experience
* Fast UI built with Next.js and Tailwind CSS
* Apply/Shortlist buttons linked to external job portals
* Custom favicon (optional branding support)

## Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/job-board.git
cd job-board
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env.local` file at the root of your project with the following variables:

```env
SHEET_ID=your-google-sheet-id
KEY_JSON_BASE64=your-base64-encoded-service-account-json
```

#### How to get `KEY_JSON_BASE64`

1. Go to your Google Cloud Console and create a new service account key (JSON).
2. Encode the key file using base64:

```bash
base64 sa-key.json > sa-key.base64.txt
```

3. Copy the entire content from `sa-key.base64.txt` and paste it as the value of `KEY_JSON_BASE64`.

4. Make sure your Google Sheet is shared with the service account email (from the JSON).

## Google Sheet Format

Ensure your sheet has the following headers in the first row:

```
title | skills | experience | location
```

* Skills can be comma-separated (e.g., `SQL, AWS, Python`)
* Each job entry should be a new row underneath.

Example: [Google Sheet](https://docs.google.com/spreadsheets/d/1aRDk1iBiU06PFLMcoE9JGWk8ztFzDRKTTeF8qTjMZ70/edit#gid=0)

## Running Locally

```bash
npm run dev
```

Then go to [http://localhost:3000](http://localhost:3000)

## Deployment

You can deploy this project to Vercel, Render, or any platform that supports environment variables.

Make sure to set:

* `SHEET_ID`
* `KEY_JSON_BASE64`

in your hosting platform's environment settings.

## License

MIT License
