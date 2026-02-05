import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Langly - 外国語学習アプリ",
  description: "Azure AI speechを活用した次世代の語学学習ツール",
};

export default function RootLayout({ children, }: { children: React.ReactNode; }) {
  return (
    <html lang="ja">
      <body>{/* ここに書いたものは全ページで表示されます */}
        <header className="p-4 border-b">
          <h2 className="font-bold">Langly</h2>
        </header>

        {/* childrenの部分に各ページ(page.tsx)の中身が入ります*/}
        {children}
      </body>
    </html >
  );
}

