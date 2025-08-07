import { neon } from "@neondatabase/serverless";
import { NextResponse } from "next/server";

const sql = neon(process.env.DATABASE_URL!);

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("user");
  if (!userId) return NextResponse.json({ result: [] });
  const res = await sql` SELECT * FROM conversations
    WHERE user1_id = ${userId} OR user2_id = ${userId}`;
  return NextResponse.json({ result: res }, { status: 200 });
}

export async function POST(req: Request) {
  const body = await req.json();
  try {
    
      const { sender, receiver } = body;
      const existing =
      await sql`SELECT * FROM conversations WHERE (user1_id = ${sender} AND user2_id = ${receiver}) OR (user1_id = ${receiver} AND user2_id = ${sender})`;
      
      if (existing.length > 0) {
          return NextResponse.json({ conversation_id: existing }, { status: 200 });
        }
        
        const res =
        await sql`INSERT INTO conversations (user1_id,user2_id) VALUES (${sender},${receiver}) RETURNING *`;
        return NextResponse.json({ result: res }, { status: 200 });
    } catch (error) {
      return NextResponse.json({error},{status:500})
    }
}
