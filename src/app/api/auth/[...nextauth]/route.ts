import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { query } from "@/lib/db";
import bcrypt from "bcrypt";
import { use } from "react";
import { NextAuthOptions } from "next-auth";

// 認証を行う関数を定義
export const authOptions: NextAuthOptions = {
  // 認証プロバイダーの設定
  providers: [
    CredentialsProvider({
      name: "Email and Password",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },

      // 入力されたメールアドレスとパスワードが正しいかをDBに問い合わせる
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        // DBからユーザーを探す
        const result = await query(
          "SELECT * FROM users WHERE email = $1",
          [credentials.email]
        );
        const user = result.rows[0];

        // ユーザーが存在しない場合はNG
        if (!user) {
          console.log("User not found");
          return null;
        }

        // パスワードを照合する
        const isPasswordCorrect = await bcrypt.compare(
          credentials.password,
          user.password_hash
        );
        // 失敗した場合、エラーメッセージを残す
        if (!isPasswordCorrect) {
          console.log("Invalid password");
          return null;
        }
        // 成功した場合、ユーザー情報を返す
        return {
          id: user.id.toString(),
          email: user.email,
          name: user.email.split('@')[0],
        };
      }
    })
  ],

  // セッションの設定
  session: {
    strategy: "jwt",
  },

  // 秘密鍵の設定
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

// APIとして公開
export { handler as GET, handler as POST };

/*
- NextAuth({}): 認証機能を一手に担う巨大な関数であり、{}内に認証のルールを記述する
- providers[]: NextAuthにおいてログイン手段を記述する配列
- CredentialsProvider({}): NextAuthにおける認証手段（プロバイダー）の一種であり、IDとパスワードでのログインを実現する
- GoogleProvider: Googleアカウントでログイン
- GithubProvider: GitHubアカウントでログイン
- authorize(): 本人確認の合否を決める関数でログインをクリックすると呼び出され、ログインフォームに入力された値が引数に渡る
- bcrypt.compare(): 第一引数と第二引数が一致するかを調べるbcryptのメソッド
- query(): lib/db.tsで定義した自作関数。第1引数にSQL、第2引数にデータを受け取る。
- session:{} : ログイン状態(セッション)の設定を記述するオブジェクト
- strategy: "jwt": jwtでセッション管理する
- strategy: "database": データベースでセッション情報を管理する
*/