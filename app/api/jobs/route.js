// 文件路径：app/api/jobs/route.js

import { NextResponse } from 'next/server';
import { google } from 'googleapis';

export const runtime = 'nodejs';

export async function GET() {
  try {
    // 1. 检查环境变量
    // if (!process.env.KEY_JSON) {
    //   throw new Error('Missing KEY_JSON env var');
    // }
    if (!process.env.SHEET_ID) {
      throw new Error('Missing SHEET_ID env var');
    }

    // 2. 把 KEY_JSON（大段字符串）里所有的 \\n 转回真正的换行符
    //    然后 JSON.parse 成一个对象
    const serviceAccount = JSON.parse(
        Buffer.from(process.env.KEY_JSON_BASE64, "base64").toString("utf-8")
      );

    // 3. 用 GoogleAuth 把这个对象当作凭证传入
    const auth = new google.auth.GoogleAuth({
      credentials: serviceAccount,
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    });

    const client = await auth.getClient();
    const sheets = google.sheets({ version: 'v4', auth: client });
    const spreadsheetId = process.env.SHEET_ID;

    // 4. 从 Google Sheets 读数据
    const resp = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: 'Sheet1',
    });

    const rows = resp.data.values || [];
    if (rows.length < 2) {
      // 只有标题，或者空表
      return NextResponse.json({ jobs: [] });
    }

    // 5. 第一行当作表头，其余行作为记录
    const [headers, ...data] = rows;
    const jobs = data.map((row) => {
      const obj = {};
      headers.forEach((h, i) => {
        obj[h.trim().toLowerCase()] = row[i] || '';
      });
      return {
        title: obj.title,
        skills: obj.skills,
        experience: obj.experience,
        location: obj.location,
      };
    });

    // 6. 返回 JSON，顺便加上 CDN 缓存头（可选）
    const jsonRes = NextResponse.json({ jobs });
    jsonRes.headers.set('Cache-Control', 's-maxage=60, stale-while-revalidate=300');
    return jsonRes;

  } catch (err) {
    console.error('🔥 /api/jobs error:', err);
    return NextResponse.json(
      { error: err.message || 'unknown error' },
      { status: 500 }
    );
  }
}