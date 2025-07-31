import { neon } from "@neondatabase/serverless";
import { NextResponse } from "next/server";


const sql = neon(process.env.DATABASE_URL!);


export async function GET() {
    const result = await sql`SELECT * FROM conversations ORDER BY created_at DESC;`
    return NextResponse.json({result:result},{status:200})
}

export async function POST(req:Request) {
    const body = await req.json()
    const {type ,group_name, created_by } = body

    const result = await sql`INSERT INTO conversations (type,name,created_by) VALUES (#${type},${group_name},${created_by})`
    return NextResponse.json({result:result},{status:200})
}