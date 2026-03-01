export { default } from "next-auth/middleware";

// ログインが必要なページを指定
export const config = {
  matcher: [
    "/study-items/:path*", // 登録・詳細・編集など
    "/",                   // トップページ（一覧）
  ],
};