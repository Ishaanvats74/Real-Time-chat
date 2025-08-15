import { neon } from "@neondatabase/serverless";
import { NextResponse } from "next/server";

const sql = neon(process.env.DATABASE_URL!);

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("user");

  if (!userId) return NextResponse.json({ result: [] });
  const res = await sql` SELECT * FROM conversations WHERE user1_email = ${userId} OR user2_email = ${userId}`;

  return NextResponse.json({ result: res }, { status: 200 });
}

export async function POST(req: Request) {
  const body = await req.json();
  try {
    const { sender, receiver, username1, username2 } = body;
    const existing =
      await sql`SELECT * FROM conversations WHERE (user1_email = ${sender} AND user2_email = ${receiver} ) OR (user1_email = ${receiver} AND user2_email = ${sender} )`;

    if (existing.length > 0) {
      return NextResponse.json({ result: existing }, { status: 200 });
    }

    const res =
      await sql`INSERT INTO conversations (user1_email,user2_email,username1,username2) VALUES (${sender},${receiver},${username1},${username2}) RETURNING *`;
    return NextResponse.json({ result: res }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  const body = await req.json();
  const { conversationId } = body;
  const result =
    await sql`UPDATE conversations SET new_message_time = NOW() WHERE id = ${conversationId}`;
  return NextResponse.json(
    { message: "Conversation updated", result: result },
    { status: 200 }
  );
}
