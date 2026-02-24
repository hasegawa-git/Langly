"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";

// データの型定義
interface StudyItem {
  id: number;
  title: string;
  content: string;
  created_at: string;
}

export default function Home() {
  const { data: session } = useSession();
  const [items, setItems] = useState<StudyItem[]>([]);
  const [loading, setLoading] = useState(true);

  // 1. APIからデータを取得する
  useEffect(() => {
    const fetchItems = async () => {
      if (session) {
        try {
          const res = await fetch("/api/study-items");
          if (res.ok) {
            const data = await res.json();
            setItems(data);
          }
        } catch (error) {
          console.error("Failed to fetch items:", error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    fetchItems();
  }, [session]);

  // 2. ログインしていない場合の画面
  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <h1 className="text-4xl font-bold mb-4">langly</h1>
        <p className="text-xl text-gray-600 mb-8">英語学習を、もっと身近に。もっと楽しく。</p>
        <Link href="/signup" className="bg-blue-600 text-white px-8 py-3 rounded-full font-bold hover:bg-blue-700 transition">
          無料で始める
        </Link>
      </div>
    );
  }

  // 3. ログインしている場合のメイン画面
  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">マイライブラリ</h1>
        <Link href="/study-items/create" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition">
          + 新規登録
        </Link>
      </div>

      {loading ? (
        <p>読み込み中...</p>
      ) : items.length === 0 ? (
        <div className="text-center py-20 border-2 border-dashed rounded-lg">
          <p className="text-gray-500">まだ登録されたデータがありません。</p>
          <p className="text-gray-500">最初の例文を登録してみましょう！</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {items.map((item) => (
            <div key={item.id} className="p-4 border rounded-lg shadow-sm bg-white hover:shadow-md transition">
              <h2 className="text-xl font-bold text-blue-600 mb-2">{item.title}</h2>
              <p className="text-gray-700 line-clamp-2">{item.content}</p>
              <div className="mt-3 text-xs text-gray-400">
                登録日: {new Date(item.created_at).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}