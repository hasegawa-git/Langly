"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreateStudyItemPage() {
  // 入力フォームの状態を管理
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false); // 送信中フラグ
  const router = useRouter();

  // フォーム送信時の処理
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true); // ボタンを無効化して連打防止

    try {
      // API エンドポイントにデータを送る
      const res = await fetch("/api/study-items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content }),
      });

      if (res.ok) {
        alert("保存に成功しました！");
        // 保存後はトップページに戻る
        router.push("/");
        // トップページのデータを最新にするためにリフレッシュ
        router.refresh();
      } else {
        alert("保存に失敗しました。ログイン状態を確認してください。");
      }
    } catch (error) {
      console.error(error);
      alert("通信エラーが発生しました。");
    } finally {
      setIsSubmitting(false); // 処理完了後にボタンを有効化
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-8 bg-white shadow-md rounded-lg mt-10">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">新しい例文を登録</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* タイトル入力 */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            タイトル
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
            placeholder="例: BBCニュース 2024/01/01"
            required
          />
        </div>

        {/* 英文入力 */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            本文（英文）
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded h-48 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
            placeholder="ここに練習したい英文を貼り付けてください"
            required
          />
        </div>

        {/* 送信ボタン */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 text-white p-3 rounded-md font-bold hover:bg-blue-700 transition-colors disabled:bg-blue-300"
        >
          {isSubmitting ? "保存中..." : "保存する"}
        </button>
      </form>
    </div>
  );
}