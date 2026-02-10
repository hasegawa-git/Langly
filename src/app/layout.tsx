import type { Metadata } from "next";
import "./globals.css";
import NextAuth from "next-auth";
import NextAuthProvider from "@/components/NextAuthProvider";

export const metadata: Metadata = {
  title: "Langly - 外国語学習アプリ",
  description: "Azure AI speechを活用した次世代の語学学習ツール",
};

export default function RootLayout({ children, }: { children: React.ReactNode; }) {
  return (
    <html lang="ja">
      <body>
        <NextAuthProvider>
          {children}
        </NextAuthProvider>
      </body>
    </html >
  );
}

