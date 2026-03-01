-- ユーザーテーブルを作成
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    create_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 学習データを保存するテーブルを作成
CREATE TABLE IF NOT EXISTS study_items (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  create_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- セキュリティ設定：自分のデータだけを見られるようにする（RLS）
ALTER TABLE study_items ENABLE ROW LEVEL SECURITY;

-- ポリシーを設定する
 CREATE POLICY "Users can manage their own study items"
  ON study_items
  FOR ALL
  USING (true);

/*
- CREATE構文: CREATE テーブル名(カラム名 型定義 制約, ...)
- PRIMARY KEY: 主キー
- REFERENCES aaa(bbb): aaaテーブルのbbbと紐付ける
- ON DELETE CASCADE: 紐づいているテーブルのデータが消えたら、こちらのテーブルでも削除する
- CURRENT_TIMESTAMP: データ作成時の時間
- ALTER TABLE aaa: aaaテーブルを変更する
- ENABEL ROW LEVEL SECURITY: 行レベルセキュリティを有効にする
- CREATE POLICY: ポリシーを作成する 
- FOR ALL: SELECT、INSERT、DELETE等のすべての操作を対象とする
*/