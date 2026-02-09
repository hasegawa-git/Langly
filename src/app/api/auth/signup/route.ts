import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import bcrypt from "bcrypt";
import { request } from "http";
import { error } from "console";

// 認証情報をDBに保存する関数を定義
export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    // バリデーション
    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    // パスワードをハッシュ化
    const hashedPassword = await bcrypt.hash(password, 10);

    // DBに保存
    const result = await query(
      "INSERT INTO users (email, password_hash) VALUES ($1,$2) RETURNING id, email ",
      [email, hashedPassword]
    );

    return NextResponse.json({
      message: "User created successfully",
      user: result.rows[0],
    }, { status: 201 });

  } catch (error: any) {
    // メールアドレスが既に使われている場合などのエラー処理
    if (error.code === '23505') {
      return NextResponse.json({ error: "Email already exists" }, { status: 400 });
    }
    console.error("Singup error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

/*
- aaa
- aaa
- aaa
*/