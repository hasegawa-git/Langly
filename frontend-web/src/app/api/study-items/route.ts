import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { query } from "../../../lib/db";
import { authOptions } from "../auth/[...nextauth]/route";
import { error } from "console";

// GETリクエストの処理を定義
export async function GET() {
  try {
    // セッションを確認
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // ログインユーザーのデータだけをDBから取得
    const result = await query(
      "SELECT * FROM study_items WHERE user_id = $1 ORDER BY created_at DESC",
      [Number(session.user.id)]
    );

    // 取得したリストを返す
    return NextResponse.json(result.rows);

  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// 学習データを新規登録するAPIの関数を定義
export async function POST(request: Request) {
  try {
    // サーバーサイドで「現在ログインしているユーザー」のセッションを取得
    const session = await getServerSession(authOptions);

    // ログインしていない場合は401エラーを返す
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // フロントエンドから送られてきたJSONデータ（title, content）を解析
    const { title, content } = await request.json();

    // どちらかが空っぽの場合は、400エラーを返す
    if (!title || !content) {
      return NextResponse.json({ error: "Titile and content are required" }, { status: 400 });
    }

    // データベースにデータを挿入
    const result = await query(
      "INSERT INTO study_items (user_id, title, content) VALUES($1, $2, $3) RETURNING *",
      [Number(session.user.id), title, content]
    );

    // 保存に成功したら、保存されたデータそのものと 201テータスを返す
    return NextResponse.json(result.rows[0], { status: 201 });

    // 想定外のエラーが発生した場合は、ログを出力して500エラーを返す
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

/*
- getServerSession: アクセスしてきたユーザの情報を取得するAuth.jsのライブラリで、引数には認証の設定をとる
*/