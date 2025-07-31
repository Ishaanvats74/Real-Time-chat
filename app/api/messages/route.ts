import { neon } from "@neondatabase/serverless";
import { NextResponse } from "next/server";

const sql = neon(process.env.DATABASE_URL!);
export async function POST(req:Request) {
    const body = await req.json()
    const {conversation_id , sender_id,context} = body 

    const result = await sql`INSERT INTO messages (conversation_id,sender_id,context) VALUES (${conversation_id},${sender_id},${context})`
    return NextResponse.json({result},{status:200})
}


export async function GET() {
    const result = await sql`SELECT * FROM messages WHERE ()`
    return NextResponse.json({result},{status:200})
}