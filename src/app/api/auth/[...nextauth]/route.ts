import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { query } from "@/lib/db"

// 認証を行う関数を定義
const handler = NextAuth({
  // 認証プロバイダーの設定
  providers: [
    CredentialsProvider({
      name: "Email and Password",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // 入力されたメールアドレスとパスワードが正しいかをDBに問い合わせる
        console.log("Login attempt:", credentials?.email);
        return null
      }
    })
  ],

  // セッションの設定
  session: {
    strategy: "jwt",
  },

  // 秘密鍵の設定
  secret: process.env.NEXTAUTH_SECRET,
});

// APIとして公開
export { handler as GET, handler as POST };

/*
- NextAuth({}): 認証機能を一手に担う巨大な関数であり、{}内に認証のルールを記述する
- providers[]: NextAuthにおいてログイン手段を記述する配列
- CredentialsProvider({}): NextAuthにおける認証手段（プロバイダー）の一種であり、IDとパスワードでのログインを実現する
- GoogleProvider: Googleアカウントでログイン
- GithubProvider: GitHubアカウントでログイン
- authorize(): 本人確認の合否を決める関数でログインをクリックすると呼び出され、ログインフォームに入力された値が引数に渡る
- session:{} : ログイン状態(セッション)の設定を記述するオブジェクト
- strategy: "jwt": jwtでセッション管理する
- strategy: "database": データベースでセッション情報を管理する
*/