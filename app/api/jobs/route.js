// app/api/jobs/route.js
import { NextResponse } from "next/server";
import { google } from "googleapis";
import fs from "fs";
import path from "path";

export const runtime = "nodejs";

export async function GET() {
  try {
    // 1. 确保环境变量里有 SERVICE_ACCOUNT_KEY_PATH
    if (!process.env.SERVICE_ACCOUNT_KEY_PATH) {
      throw new Error("Missing SERVICE_ACCOUNT_KEY_PATH env var");
    }

    // 2. 根据路径加载私钥文件内容
    const keyFilePath = process.env.SERVICE_ACCOUNT_KEY_PATH;
    // 这里把相对路径转成绝对路径，以防读不到
    const fullPath = path.isAbsolute(keyFilePath)
      ? keyFilePath
      : path.join(process.cwd(), keyFilePath);

    if (!fs.existsSync(fullPath)) {
      throw new Error(`Service account key file not found at ${fullPath}`);
    }

    // 3. 读文件并 parse
    const fileContents = fs.readFileSync(fullPath, "utf8");
    let serviceAccount;
    try {
      serviceAccount = JSON.parse(fileContents);
    } catch (e) {
      throw new Error("Failed to JSON.parse the contents of SERVICE_ACCOUNT_KEY_PATH");
    }

    // 4. 用 GoogleAuth 初始化
    const auth = new google.auth.GoogleAuth({
      credentials: serviceAccount,
      scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
    });
    const client = await auth.getClient();
    const sheets = google.sheets({ version: "v4", auth: client });

    // 5. 确保 SHEET_ID
    const spreadsheetId = process.env.SHEET_ID;
    if (!spreadsheetId) {
      throw new Error("Missing SHEET_ID env var");
    }

    // 6. 去拉取表格内容
    const resp = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: "Sheet1",
    });
    const rows = resp.data.values || [];
    if (rows.length < 2) {
      return NextResponse.json({ jobs: [] });
    }

    // 7. 解析成对象数组
    const [headers, ...data] = rows;
    const jobs = data.map((row) => {
      const obj = {};
      headers.forEach((h, i) => {
        obj[h.trim().toLowerCase()] = row[i] || "";
      });
      return {
        title: obj.title,
        skills: obj.skills,
        experience: obj.experience,
        location: obj.location,
      };
    });

    // 8. 返回结果并加上缓存头
    const response = NextResponse.json({ jobs });
    response.headers.set(
      "Cache-Control",
      "s-maxage=60, stale-while-revalidate=300"
    );
    return response;
  } catch (err) {
    console.error("🔥 /api/jobs error:", err);
    return NextResponse.json(
      { error: err.message || "unknown error" },
      { status: 500 }
    );
  }
}