import { neon } from "@neondatabase/serverless";
import { NextResponse } from "next/server";

const sql = neon(process.env.DATABASE_URL!);
export async function POST(req: Request) {
  const body = await req.json();
    const timeStamp = new Date().toLocaleString()
  const { username, email, profile } = body;
  const res =
    await sql`INSERT INTO users (username,email,profile,created_at) VALUES (${username}, ${email}, ${profile},${timeStamp})`;

  return NextResponse.json({ res }, { status: 200 });
}
