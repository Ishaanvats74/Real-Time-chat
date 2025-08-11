import { neon } from "@neondatabase/serverless";
import { NextResponse } from "next/server";

const sql = neon(process.env.DATABASE_URL!);

export async function POST(req: Request) {
  const body = await req.json();
  const timeStamp = new Date().toLocaleString()
  const { username, email, profile } = body;
  const existingUser = await sql`SELECT * FROM users WHERE email = ${email}`;
if (existingUser.length > 0) {
    return NextResponse.json({ result: existingUser }, { status: 200 });
  }
  const res = await sql`INSERT INTO users (username,email,profile,created_at) VALUES (${username}, ${email}, ${profile},${timeStamp})RETURNING *`;

  return NextResponse.json({result: res }, { status: 200 });
}

export async function GET(req:Request) {
  const {searchParams} = new URL(req.url)
  const user = searchParams.get('query');

  const res = await sql`SELECT * FROM users WHERE username ILIKE ${"%"+user+"%"} OR email ILIKE ${"%"+user+"%"}`
  return NextResponse.json({result:res},{status:200})
}