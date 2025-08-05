import { neon } from "@neondatabase/serverless";
import { NextResponse } from "next/server";

const sql = neon(process.env.DATABASE_URL!);

export async function GET() {
    const res = await sql`SELECT * FROM conversations`
    return NextResponse.json({result:res},{status:200})
}