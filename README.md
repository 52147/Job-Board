# Job Board with Google Sheets Integration

This project is a job board UI that fetches job listings directly from a Google Sheet using Google Sheets API.

## Features

- Responsive UI built with React and Tailwind CSS
- Google Sheets as the backend source of truth
- Displays jobs grouped by location
- Apply/Shortlist buttons linked to external job portals
- Real-time update capability by modifying the connected Google Sheet

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

Create a .env.local file at the root of your project and add the following:
```bash
GOOGLE_SERVICE_ACCOUNT_EMAIL=your-service-account-email@your-project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
GOOGLE_SHEET_ID=your-google-sheet-id
```
Make sure your Google Sheet is shared with your service account email.

### 4. Start the Development Server
```bash
npm run dev
```
The app will be available at http://localhost:3000.

## Google Sheet Format

Make sure the sheet has the following headers in the first row:
```bash
title | skills | experience | location
```
Each job should be a new row underneath with appropriate values.

## Deployment

You can deploy this project to platforms like Vercel or Netlify. Ensure environment variables are configured in the dashboard.

## License

MIT License
