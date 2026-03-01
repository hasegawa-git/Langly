"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  // 送信ボタンが押された時の処理
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // サーバー（API）への問い合わせを行う関数を定義
    const res = await fetch("/api/auth/signup", {
      method: "POST",
      body: JSON.stringify({ email, password }),
      headers: { "Content-Type": "application/json" },
    });

    if (res.ok) {
      router.push("/");
    } else {
      const data = await res.json();
      setError(data.error);
    }
  };

  // 画面（HTML部分）
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <form onSubmit={handleSubmit} className="p-8 bg-white shadow-md rounded-lg border border-gray-200">
        <h1 className="text-2xl font-bold mb-4">Sign Up</h1>

        {/* エラーがある時だけ、赤い文字で表示する（短絡評価 &&） */}
        {error && <p className="text-red-500 mb-4 text-sm">{error}</p>}

        {/* メールアドレス入力欄 */}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 mb-4 border rounded"
          required
        />

        {/* パスワード入力欄 */}
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 mb-4 border rounded"
          required
        />

        {/* 送信ボタン */}
        <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
          Create Account
        </button>
      </form>
    </div >
  );
}

/*
- e.: イベントに関する詳細情報をもつというオブジェクトで、イベントオブジェクトと呼ばれる
- React.FormEvent: フォームに関するイベントの情報が入ることを明示する型定義
- e.preventDefault: JavaScriptのデフォルトの動作（ページのリロード）を抑制する
- fetch(): HTTPリクエストを送る関数であり、第一引数はリクエスト先のURL、第二引数はオプションをとる
           Responseオブジェクトが返ってくる
- JSON.stringify({ aaa }): JavaScriptのオブジェクトをJSON文字列に変換する
- headers: サーバーに対して追加情報を伝えるヘッダー（添え状のようなもの）
- res.ok: ステータスコードが200番台（成功）のときにtrueになるプロパティ
- router.push: 指定したリンクにぺージ遷移ができるメソッドで第一引数に遷移先のURLをとる
- .json: json文字列をJavaScriptのオブジェクトに変換するメソッド
- e.target: targetはイベントが発生した要素を参照する
- e.target.value: ユーザーがフォーム要素に入力したデータを取得する
*/