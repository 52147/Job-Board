import { NextResponse } from 'next/server'
import { google } from 'googleapis'
import fs from 'fs'
import path from 'path'

export const runtime = 'nodejs'

export async function GET() {
  try {
    const keyPath = path.join(process.cwd(), 'sa-key.json')
    if (!fs.existsSync(keyPath)) throw new Error('sa-key.json not found')

    const serviceAccount = JSON.parse(fs.readFileSync(keyPath, 'utf8'))

    const auth = new google.auth.GoogleAuth({
      credentials: serviceAccount,
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    })

    const client = await auth.getClient()
    const sheets = google.sheets({ version: 'v4', auth: client })

    const spreadsheetId = process.env.SHEET_ID
    if (!spreadsheetId) throw new Error('Missing SHEET_ID env var')

    const resp = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: 'Sheet1',
    })

    const rows = resp.data.values || []
    if (rows.length < 2) return NextResponse.json({ jobs: [] })

    const [headers, ...data] = rows
    const jobs = data.map(row => {
      const obj = {}
      headers.forEach((h, i) => (obj[h.trim().toLowerCase()] = row[i] || ''))
      return {
        title: obj.title,
        skills: obj.skills,
        experience: obj.experience,
        location: obj.location,
      }
    })

    const res = NextResponse.json({ jobs })
    res.headers.set('Cache-Control', 's-maxage=60, stale-while-revalidate=300')
    return res

  } catch (err) {
    console.error('🔥 /api/jobs error:', err)
    return NextResponse.json(
      { error: err.message || 'unknown error' },
      { status: 500 }
    )
  }
}