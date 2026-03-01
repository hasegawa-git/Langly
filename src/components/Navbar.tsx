"use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className="bg-white border-b border-gray-200 py-4 shadow-sm">
      <div className="max-w-4xl mx-auto px-6 flex justify-between items-center">
        <Link href="/" className="text-2xl font-black text-blue-600 tracking-tighter">
          langly
        </Link>

        <div className="flex gap-6 items-center">
          {session ? (
            <>
              <Link href="/study-items/create" className="text-sm font-medium text-gray-600 hover:text-blue-600">
                新規登録
              </Link>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="text-sm font-medium text-red-500 hover:text-red-700"
              >
                ログアウト
              </button>
            </>
          ) : (
            <Link href="/signup" className="text-sm font-medium text-blue-600">
              サインアップ
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

/*
- useSession: セッションを管理するReactフックで、2つのオブジェクト（dataとstatus）を返す
- { aaa: bbb }: aaaにbbbという名前を付け替えるJavaScriptのエイリアスという処理
- aaa?.: aaaがnullの場合にエラーを出さずにスルーするという処理を実現する
- signOut(): NextAuthの標準搭載の関数で、クッキー（ログインの証拠）を消してログアウトする
*/