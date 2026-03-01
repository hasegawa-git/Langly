"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function StudyItemDetailPage({ params }: { params: { id: string } }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetch(`/api/study-items/${params.id}`)
      .then(res => res.json())
      .then(data => {
        setTitle(data.title);
        setContent(data.content);
      });
  }, [params.id]);

  const handleUpdate = async () => {
    const res = await fetch(`/api/study-items/${params.id}`, {
      method: "PUT",
      body: JSON.stringify({ title, content }),
      headers: { "Content-Type": "application/json" },
    });
    if (res.ok) {
      setIsEditing(false);
      router.refresh();
    }
  };

  const handleDelete = async () => {
    if (!confirm("本当に削除しますか？")) return;
    const res = await fetch(`/api/study-items/${params.id}`, { method: "DELETE" });
    if (res.ok) {
      router.push("/");
      router.refresh();
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-xl mt-10">
      {isEditing ? (
        <div className="space-y-4">
          <input value={title} onChange={(e) => setTitle(e.target.value)} className="w-full p-2 border rounded text-black font-bold text-xl" />
          <textarea value={content} onChange={(e) => setContent(e.target.value)} className="w-full p-2 border rounded h-64 text-black text-lg" />
          <div className="flex gap-2">
            <button onClick={handleUpdate} className="bg-blue-600 text-white px-4 py-2 rounded">保存</button>
            <button onClick={() => setIsEditing(false)} className="bg-gray-400 text-white px-4 py-2 rounded">キャンセル</button>
          </div>
        </div>
      ) : (
        <div>
          <h1 className="text-3xl font-bold mb-4 text-gray-800">{title}</h1>
          <p className="text-xl text-gray-700 bg-gray-50 p-6 rounded-lg mb-6 italic leading-relaxed">"{content}"</p>
          <div className="flex gap-4">
            <button onClick={() => setIsEditing(true)} className="text-blue-600 hover:underline">編集する</button>
            <button onClick={handleDelete} className="text-red-500 hover:underline">削除する</button>
            <button onClick={() => router.push("/")} className="text-gray-500 hover:underline">戻る</button>
          </div>
        </div>
      )}
    </div>
  );
}