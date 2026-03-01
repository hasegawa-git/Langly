import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { query } from "@/lib/db";
import { authOptions } from "../../auth/[...nextauth]/route";

// 個別データの取得 (GET)
export async function GET(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const result = await query(
    "SELECT * FROM study_items WHERE id = $1 AND user_id = $2",
    [params.id, Number(session.user.id)]
  );
  return NextResponse.json(result.rows[0]);
}

// データの更新 (PUT)
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { title, content } = await req.json();
  const result = await query(
    "UPDATE study_items SET title = $1, content = $2 WHERE id = $3 AND user_id = $4 RETURNING *",
    [title, content, params.id, Number(session.user.id)]
  );
  return NextResponse.json(result.rows[0]);
}

// データの削除 (DELETE)
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await query(
    "DELETE FROM study_items WHERE id = $1 AND user_id = $2",
    [params.id, Number(session.user.id)]
  );
  return NextResponse.json({ message: "Deleted successfully" });
}