import { NextResponse } from "next/server";
import { query } from "../../../lib/db";

// GETリクエストを送る関数
export async function GET() {
  try {
    // テストデータを挿入するSQL
    const insertSql = `
      INSERT INTO users (email, password_hash)
      VALUES ($1, $2)
      RETURNING id, email, create_at;  
    `;
    const values = ['test@example.com', 'hashed_password_123'];

    // SQLクエリを実行
    const result = await query(insertSql, values);

    // 成功処理と失敗処理
    return NextResponse.json({
      message: 'Successfully connected to DB!',
      user: result.rows[0],
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Database connection failed' }, { status: 500 });
  }
}

/*
- ($1, $2): SQLインジェクションを防ぐためのプレースホルダー
- RETURNING...: これをつけると「保存したばかりxxxを教えて」と、DBから返答をもらえる
- query(): lib/db.tsで定義した自作関数。第1引数にSQL、第2引数にデータを受け取る。
- NextResponse: クライアントへ返す『返信用の封筒』のようなNext.js標準搭載のオブジェクト
- .json(...): JSON形式に変換し、()内にJSONコードを書く
- console.error: コンソールにて異常事態を伝える文。引数は複数とれる。
- aaa.rows[x]: aaa（配列）のインデックス番号0を取り出す
*/