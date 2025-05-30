// app/api/jobs/route.js
import { google } from 'googleapis'
import { NextResponse } from 'next/server'
import { readFileSync } from 'fs'
import { join } from 'path'

export const runtime = 'nodejs'    // ensure we’re running in Node

export async function GET(request) {
  try {
    // load your service account key (in sa-key.json, git-ignored)
    const keyPath = join(process.cwd(), 'sa-key.json')
    const serviceAccount = JSON.parse(readFileSync(keyPath, 'utf8'))

    // auth setup
    const auth = new google.auth.GoogleAuth({
      credentials: serviceAccount,
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    })
    const client = await auth.getClient()
    const sheets = google.sheets({ version: 'v4', auth: client })

    // make sure you have SHEET_ID in .env.local
    const spreadsheetId = process.env.SHEET_ID
    if (!spreadsheetId) {
      throw new Error('Missing SHEET_ID env var')
    }

    // fetch
    const resp = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: 'Sheet1',
    })
    const rows = resp.data.values || []
    if (rows.length < 2) {
      return NextResponse.json({ jobs: [] })
    }

    // first row headers, map the rest
    const [headers, ...data] = rows
    const jobs = data.map(row => {
      const obj = {}
      headers.forEach((h, i) => {
        obj[h.trim().toLowerCase()] = row[i] || ''
      })
      return {
        title:      obj.title,
        skills:     obj.skills,
        experience: obj.experience,
        location:   obj.location,
      }
    })

    // cache for 60s
    const res = NextResponse.json({ jobs })
    res.headers.set('Cache-Control', 's-maxage=60, stale-while-revalidate=300')
    return res

  } catch (err) {
    console.error('🔴 /api/jobs error:', err)
    return NextResponse.json(
      { error: err.message || 'Unknown error' },
      { status: 500 }
    )
  }
}