// Node.jsとPostgreSQLを繋ぐパイプラインを作るための設定ファイル

import { Pool } from 'pg';

// DB接続用のプールを作成し、接続情報を格納
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// SQLを実行する共通関数queryを定義
export const query = async (text: string, params?: any[]) => {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log('executed query', { text, duration, rows: res.rowCount });
    return res;
  } catch (error) {
    console.error('error executing query', error);
    throw error;
  }
};

/*
- pg: Node.jsからPostgreSQLへ接続・操作するためのライブラリ
- プール: DBへの接続をあらかじめ何本か確保しておき、使い回す仕組み
- Pool: DB接続を取得→クエリ実行→接続返却を自動で行ってくれるクラス
- new Pool(): Poolクラスのインスタンスを作成。オブジェクトであり、()にはDB接続情報を入れる。
- connectionString: pgが定めたPoolオブジェクトのキー名
- process: Node.jsが持っている今動いているプログラムの情報オブジェクト
- params: pgの予約語でプレースホルダーに入る値を表す
- params?の?: その引数は省略してよいという意味
- any[]: TypeScriptの「なんでもいい」を表す型
- pool.query: 接続プールを使ってSQLを実行する機能であり、引数にはtext（SQL文）とparams（プレースホルダーに入る値）をとる
- aaa.rowCount: SQLクエリの影響を取得する
- error: Errorオブジェクトであり、中身にはmessage, stack, codeなどのエラー情報が入っている
- throw: エラーとして処理を中断し、try/catchに飛ばす
*/