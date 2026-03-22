# Langly
外国語学習をより楽しく、スマートに。
Azure AI Speechを活用したリスニング特化型の語学学習アプリケーション。

## 技術スタック
- **Web Frontend**: Next.js / TypeScript / Tailwind CSS
- **iOS**: Swift / SwiftUI
- **Backend**: Python / FastAPI
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth
- **Storage**: Supabase Storage
- **AI**: Azure AI Speech (TTS)
- **Hosting**: Cloudflare Pages / Workers

## ディレクトリ構成
```
langly/
├── frontend-web/   # Next.js Webアプリ
├── frontend-ios/   # Swift/SwiftUI iOSアプリ
├── backend/        # FastAPI バックエンド
└── docs/           # 設計・要件ドキュメント
```

## ローカル環境構築

### 前提条件
- Node.js 20以上
- npm

### セットアップ

```bash
cd frontend-web
npm install
```

### 環境変数

`frontend-web/.env.local` を作成し、以下を設定する。

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

### 起動

```bash
cd frontend-web
npm run dev
```

`http://localhost:3000` で起動する。
