"use client"

import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";

// ログイン状態（セッション）をアプリ全体で共有する関数を定義
export default function NextAuthProvider({ children }: { children: ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
}

/*
- SessionProvider: NextAuth.jsにおいてReactコンポーネントツリー全体で認証セッション情報を共有するためのコンポーネント
- ReactNode: Reactの要素ならなんでもOKな型定義
- NextAuthProvider: layout.tsxにおいてこの関数で囲まれた{children}にはセッション情報が共有される
*/