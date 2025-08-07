import { neon } from "@neondatabase/serverless";
import { NextResponse } from "next/server";

const sql = neon(process.env.DATABASE_URL!);
export async function GET(req:Request) {
    const { searchParams } = new URL(req.url)
    const conversation_id = searchParams.get("conversation_id")
    const res = await sql`SELECT * FROM messages WHERE (conversation_id = ${conversation_id}) ORDER BY created_at ASC`

    return NextResponse.json({result:res}, {status:200})
}

export async function POST(req:Request) {
    const body = await req.json()
    const {conversation_id,sender_id,text} = body 
    const res = await sql`INSERT INTO messages (conversation_id,sender_id,text) VALUES (${conversation_id},${sender_id},${text}) RETURNING *`

    return NextResponse.json({result:res}, {status:200})
}

