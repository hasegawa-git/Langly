# API設計書

## 認証フロー

- 認証はSupabase Authで管理
- クライアントはサインイン後にJWTトークンを取得
- 認証が必要なエンドポイントはリクエストヘッダーに `Authorization: Bearer <token>` を付与
- バックエンド側でトークンを検証し、ユーザーを識別

## エンドポイント一覧

### 認証 (`/auth`)

| メソッド | パス | 認証 | 概要 |
|---|---|---|---|
| POST | `/auth/signup` | 不要 | 新規ユーザー登録 |
| POST | `/auth/signin` | 不要 | サインイン・トークン取得 |
| POST | `/auth/signout` | 必要 | サインアウト |

#### POST `/auth/signup`
**リクエスト**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```
**レスポンス** `201`
```json
{
  "id": "uuid",
  "email": "user@example.com"
}
```

#### POST `/auth/signin`
**リクエスト**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```
**レスポンス** `200`
```json
{
  "access_token": "jwt_token",
  "token_type": "bearer"
}
```

---

### ユーザー (`/users`)

| メソッド | パス | 認証 | 概要 |
|---|---|---|---|
| GET | `/users/me` | 必要 | 自分のプロフィール取得 |
| PATCH | `/users/me` | 必要 | プロフィール更新（ユーザー名） |

#### GET `/users/me`
`email` は `auth.users` から取得。

**レスポンス** `200`
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "username": "taro"
}
```

#### PATCH `/users/me`
**リクエスト**
```json
{
  "username": "taro"
}
```
**レスポンス** `200`
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "username": "taro"
}
```

---

### 学習アイテム (`/items`)

自分が作成した学習アイテムのCRUD。

| メソッド | パス | 認証 | 概要 |
|---|---|---|---|
| GET | `/items` | 必要 | 自分の学習アイテム一覧取得 |
| POST | `/items` | 必要 | 学習アイテム作成（音声生成） |
| GET | `/items/{id}` | 必要 | 学習アイテム詳細取得 |
| PATCH | `/items/{id}` | 必要 | 学習アイテム編集 |
| DELETE | `/items/{id}` | 必要 | 学習アイテム削除 |

#### GET `/items`
**レスポンス** `200`
```json
[
  {
    "id": "uuid",
    "text": "Hello, world.",
    "audio_url": "https://storage.example.com/audio/uuid.mp3",
    "created_at": "2026-03-23T00:00:00Z"
  }
]
```

#### POST `/items`
**リクエスト**
```json
{
  "text": "Hello, world."
}
```
**レスポンス** `201`
```json
{
  "id": "uuid",
  "text": "Hello, world.",
  "audio_url": "https://storage.example.com/audio/uuid.mp3",
  "created_at": "2026-03-23T00:00:00Z"
}
```

#### PATCH `/items/{id}`
テキストを更新すると音声を自動で再生成し、`audio_url` を上書きする。

**リクエスト**
```json
{
  "text": "Hello, world!"
}
```
**レスポンス** `200`
```json
{
  "id": "uuid",
  "text": "Hello, world!",
  "audio_url": "https://storage.example.com/audio/uuid.mp3",
  "created_at": "2026-03-23T00:00:00Z"
}
```

---

### ライブラリ (`/library`)

管理者が用意した学習アイテムの閲覧。認証不要。

| メソッド | パス | 認証 | 概要 |
|---|---|---|---|
| GET | `/library` | 不要 | ライブラリアイテム一覧取得 |

#### GET `/library`
**レスポンス** `200`
```json
[
  {
    "id": "uuid",
    "text": "This is a sample sentence.",
    "audio_url": "https://storage.example.com/audio/uuid.mp3"
  }
]
```

---

### マイリスト (`/mylist`)

| メソッド | パス | 認証 | 概要 |
|---|---|---|---|
| GET | `/mylist` | 必要 | マイリスト一覧取得 |
| POST | `/mylist` | 必要 | マイリストにアイテム追加 |
| DELETE | `/mylist/{id}` | 必要 | マイリストからアイテム削除 |

#### GET `/mylist`
**レスポンス** `200`
```json
[
  {
    "id": "uuid",
    "item_id": "uuid",
    "text": "Hello, world.",
    "audio_url": "https://storage.example.com/audio/uuid.mp3"
  }
]
```

#### POST `/mylist`
**リクエスト**
```json
{
  "item_id": "uuid"
}
```
**レスポンス** `201`
```json
{
  "id": "uuid",
  "item_id": "uuid"
}
```

---

## エラーレスポンス

| ステータスコード | 意味 |
|---|---|
| `400` | リクエストの形式が不正 |
| `401` | 未認証 |
| `403` | アクセス権限なし（他人のリソース） |
| `404` | リソースが存在しない |
| `500` | サーバー内部エラー |

**共通フォーマット**
```json
{
  "detail": "エラーメッセージ"
}
```

## 変更履歴
### v0.1 (2026-03-23)
- 初版
