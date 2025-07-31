import { neon } from "@neondatabase/serverless";
import { NextResponse } from "next/server";


const sql = neon(process.env.DATABASE_URL!);

export async function GET() {
    const result = await sql`SELECT * FROM users`
    return NextResponse.json({result},{status:200})
}

export async function POST(req: Request) {
  const body = await req.json();
  const { username, email, profile } = body;
  try {
    const rows = await sql`SELECT * FROM users WHERE (email = ${email})`
    if (rows.length > 0){
        return NextResponse.json({result : "User already exists"},{status:200})
    } 
    await sql`INSERT INTO users (email,username,profile) VALUES (${email},${username},${profile})`
    return NextResponse.json({result:"User table updated"},{status:200})
  } catch (error) {
    return NextResponse.json({error:error},{status:500})
  }
}
