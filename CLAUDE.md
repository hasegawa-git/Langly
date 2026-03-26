# CLAUDE.md

## プロジェクト概要

- **サービス名**: Langly
- **コンセプト**: 自分だけのシンプルなリスニング特化型アプリ

## ディレクトリ構成

```
langly/
├── frontend-web/   # Next.js Webアプリ（TypeScript / Tailwind CSS）
├── frontend-ios/   # iOSアプリ（Swift / SwiftUI）
├── backend/        # APIサーバー（Python / FastAPI）
└── docs/           # 設計・要件ドキュメント
```

## 技術スタック

| レイヤー     | 技術                                |
| ------------ | ----------------------------------- |
| Web Frontend | Next.js / TypeScript / Tailwind CSS |
| iOS          | Swift / SwiftUI                     |
| Backend      | Python / FastAPI / asyncpg          |
| Database     | Supabase (PostgreSQL)               |
| Auth         | Supabase Auth                       |
| Storage      | Supabase Storage                    |
| AI           | Azure AI Speech (TTS)               |
| Hosting      | Cloudflare Pages / Workers          |

## ブランチ命名規則

- 言語: 英語
- 形式: `<type>/<issue番号>-<概要>`

| type       | 用途             |
| ---------- | ---------------- |
| `feat`     | 新機能           |
| `fix`      | バグ修正         |
| `docs`     | ドキュメント     |
| `chore`    | 設定・環境整備   |
| `refactor` | リファクタリング |
| `style`    | スタイル修正     |

例：`feat/34-setup-backend`

## コミットメッセージ規則

- 言語: 英語
- 形式: `<type>: <概要> (#<issue番号>)`
- 例：`feat: implement users endpoint (#41)`

## issue

- issueテンプレートを使用する（`.github/ISSUE_TEMPLATE/`）
- 1 issue = 1機能・1タスク
- タイトル: 英語
- 本文: 日本語

## PR

- PRテンプレートを使用する（`.github/PULL_REQUEST_TEMPLATE.md`）
- 必ず関連issueを記載する（`Closes #番号`）
- mainへの直接pushは禁止
- タイトル: 英語
- 本文: 日本語

## git操作

- ClaudeはgitコマンドとコミットメッセージとPRの提示のみ行う
- 実行はユーザーが行う
