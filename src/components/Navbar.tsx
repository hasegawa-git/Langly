"use client"

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { sign } from "crypto";

// ナビゲーションバーを定義
export default function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className="flex items-center justify-between p-4 bg-gray-800 text-white">
      <Link href="/" className="text-xl font-bold">Langly</Link>
      <div className="flex gap-4">
        {session ? (
          <>
            <span>{session.user?.email}</span>
            <button
              onClick={() => signOut()}
              className="bg-red-500 px-3 py-1 rounded"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link href="/api/auth/signin">Login</Link>
            <Link href="/signup" className="bg-blue-500 px-3 py-1 rounded">Sign Up</Link>
          </>
        )}
      </div>
    </nav >
  );
}

/*
- useSession: セッションを管理するReactフックで、2つのオブジェクト（dataとstatus）を返す
- { aaa: bbb }: aaaにbbbという名前を付け替えるJavaScriptのエイリアスという処理
- aaa?.: aaaがnullの場合にエラーを出さずにスルーするという処理を実現する
- signOut(): NextAuthの標準搭載の関数で、クッキー（ログインの証拠）を消してログアウトする
*/