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

  // 1. 読み上げ機能の関数 
  const handlePlay = (text: string) => {
    // ブラウザが読み上げ中なら一度止める
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = 0.9;

    window.speechSynthesis.speak(utterance);
  };

  // 2. APIからデータを取得する
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

  // --- 画面表示 A: ログインしていない場合 ---
  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <h1 className="text-5xl font-extrabold mb-4 text-blue-600">langly</h1>
        <p className="text-xl text-gray-600 mb-8 text-center">
          聴いて、覚える。あなたのためのリスニング・ライブラリ。
        </p>
        <Link href="/signup" className="bg-blue-600 text-white px-8 py-3 rounded-full font-bold hover:bg-blue-700 transition shadow-lg">
          無料で始める
        </Link>
      </div>
    );
  }

  // --- 画面表示 B: ログインしている場合 ---
  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800">マイライブラリ</h1>
        <Link href="/study-items/create" className="bg-green-600 text-white px-4 py-2 rounded-md font-bold hover:bg-green-700 transition shadow">
          + 新規登録
        </Link>
      </div>

      {loading ? (
        <p className="text-center text-gray-500">読み込み中...</p>
      ) : items.length === 0 ? (
        <div className="text-center py-20 border-2 border-dashed rounded-lg bg-gray-50">
          <p className="text-gray-500 mb-4">まだ登録された例文がありません。</p>
          <Link href="/study-items/create" className="text-blue-600 font-bold hover:underline">
            最初の例文を登録してみましょう！
          </Link>
        </div>
      ) : (
        <div className="grid gap-6">
          {items.map((item) => (
            <div key={item.id} className="p-6 border rounded-xl shadow-sm bg-white hover:shadow-md transition border-gray-100">
              <div className="flex justify-between items-start mb-4">
                <Link href={`/study-items/${item.id}`} className="hover:underline flex-1">
                  <h2 className="text-xl font-bold text-gray-900 hover:text-blue-600 transition">
                    {item.title}
                  </h2>
                </Link>

                {/* 再生ボタン */}
                <button
                  onClick={() => handlePlay(item.content)}
                  className="bg-blue-100 text-blue-600 p-2 rounded-full hover:bg-blue-200 transition ml-4"
                  title="音声を再生"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </button>
              </div>

              <p className="text-gray-700 text-lg leading-relaxed bg-gray-50 p-4 rounded-lg italic line-clamp-2">
                "{item.content}"
              </p>

              <div className="mt-4 text-xs text-gray-400 flex justify-end">
                登録日: {new Date(item.created_at).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}