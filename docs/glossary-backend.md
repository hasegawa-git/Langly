# Langly 用語集

## `os`（Python標準ライブラリ）
- **概要**: OSの機能を使って環境変数の取得やディレクトリの作成などができる

### 関数
- `os.getenv(key, default)`: 第1引数に環境変数名、第2引数にデフォルト値を取り環境変数の値を取得する


## `contextlib`（Python標準ライブラリ）
- **概要**: 前処理・後処理を定義する機能をまとめた道具箱

### 関数
- `contextlib.asynccontextmanager`: `@` をつけて使うと、`yield` を挟んでアプリの起動時と終了時の処理をまとめて記述できる


## `uuid`（Python標準ライブラリ）
- **概要**: UUID（一意な識別子）を生成する機能をまとめた道具箱

### 関数
- `uuid.uuid4()`: ランダムなUUIDを生成して返す


## `asyncio`（Python標準ライブラリ）
- **概要**: 非同期処理を扱うための機能をまとめた道具箱

### クラス
- `asyncio.AbstractEventLoop`
  - **概要**: 非同期処理の実行を管理するイベントループ
  - **メソッド**:
    - `.run_in_executor(executor, func)`: 同期関数を別スレッドで実行し、完了を非同期で待つ。`executor` に `None` を渡すとデフォルトのスレッドプールを使用する

### 関数
- `asyncio.get_event_loop()`: 現在動いているイベントループ（`asyncio.AbstractEventLoop` のインスタンス）を返す


## `fastapi`（外部ライブラリ）
- **概要**: WebAPIを作る機能をまとめた道具箱
- **インストール**: `pip install fastapi`

### クラス
- `FastAPI`
  - **概要**: APIアプリ本体の設計図（クラス）で、引数には `title`（APIの名前）や `lifespan` など様々な値を取る
  - **使用例**: `app = FastAPI(title="Langly API", lifespan=lifespan)`
  - **メソッド**:
    - `.include_router(router)`: 引数に router（APIRouterのインスタンス）を取り、エンドポイントを登録する

- `APIRouter`
  - **概要**: エンドポイントをグループ化して管理する。`prefix` でURLの共通部分を、`tags` でSwaggerUIのグループ名を指定する
  - **使用例**: `router = APIRouter(prefix="/users", tags=["users"])`

- `HTTPBearer`
  - **概要**: `Authorization` ヘッダーの `Bearer <token>` を取り出す
  - **使用例**: `security = HTTPBearer()`

- `HTTPAuthorizationCredentials`
  - **概要**: Bearerトークンの中身を保持する
  - **プロパティ**:
    - `.credentials`: トークン文字列を取り出せる

- `HTTPException`
  - **概要**: HTTPエラーレスポンスを返すための例外クラス
  - **使用例**: `raise HTTPException(status_code=401, detail="無効なトークンです")`

### 関数
- `Depends(func)`: 「この関数を先に実行してから処理して」と依存関係を定義する
- `status.HTTP_*`: `HTTP_401_UNAUTHORIZED` などのHTTPステータスコードの定数集


## `pydantic`（外部ライブラリ）
- **概要**: データの型チェック・バリデーションをする機能をまとめた道具箱
- **インストール**: `pip install pydantic`

### クラス
- `BaseModel`
  - **概要**: リクエスト・レスポンスのデータ構造を定義する親クラスで、継承して使う
  - **使用例**:
    ```python
    class UserResponse(BaseModel):
        id: str
        email: str
    ```


## `asyncpg`（外部ライブラリ）
- **概要**: PythonからDB（PostgreSQL）を非同期で操作する機能をまとめた道具箱
- **インストール**: `pip install asyncpg`

### クラス
- `asyncpg.Pool`
  - **概要**: DBへの接続を複数まとめて管理するコネクションプール
  - **メソッド**:
    - `.close()`: プールの全接続を閉じる
    - `.fetchrow(query, *args)`: SQLを実行して結果の **1行** を返す
    - `.fetch(query, *args)`: SQLを実行して結果の **全行** をリストで返す
    - `.execute(query, *args)`: SQLを実行してコマンドタグ（文字列）を返す

### 関数
- `asyncpg.create_pool(dsn)`: 引数にDB接続URLを取り、コネクションプールを新規作成する


## `httpx`（外部ライブラリ）
- **概要**: PythonからHTTPリクエストを送る機能をまとめた道具箱
- **インストール**: `pip install httpx`

### クラス
- `httpx.AsyncClient`
  - **概要**: 非同期HTTPクライアント。`async with` で使う
  - **使用例**:
    ```python
    async with httpx.AsyncClient() as client:
        response = await client.get(url)
    ```
  - **メソッド**:
    - `.get(url)`: GETリクエストを送る
    - `.json()`: レスポンスをJSONとしてパースしてdictで返す


## `PyJWT`（`jwt`）（外部ライブラリ）
- **概要**: JWTトークンを作成・検証する機能をまとめた道具箱
- **インストール**: `pip install PyJWT`

### クラス
- `jwt.ExpiredSignatureError`
  - **概要**: トークンの有効期限切れ時に発生する例外

- `jwt.InvalidTokenError`
  - **概要**: トークンが不正な場合に発生する例外（`ExpiredSignatureError` の親クラス）

### 関数
- `jwt.get_unverified_header(token)`: トークンを検証せずにヘッダー情報だけ取り出す
- `jwt.decode(token, key, algorithms, audience)`: トークンを公開鍵で検証して中身のデータを取り出す
- `jwt.algorithms.ECAlgorithm.from_jwk(key)`: JWK形式の公開鍵をPythonで使える形に変換する


## `python-dotenv`（`dotenv`）（外部ライブラリ）
- **概要**: `.env` ファイルの内容を環境変数として読み込む機能をまとめた道具箱
- **インストール**: `pip install python-dotenv`

### 関数
- `load_dotenv()`: `.env` ファイルを読み込んで `os.getenv()` で環境変数を参照できるようにする


## `supabase`（外部ライブラリ）
- **概要**: Supabase の各機能（DB・Auth・Storage など）をPythonから操作する機能をまとめた道具箱
- **インストール**: `pip install supabase`

### クラス
- `Client`
  - **概要**: Supabase への接続を管理するクライアントオブジェクト
  - **プロパティ**:
    - `.storage`: Supabase Storage を操作するためのインターフェース

### 関数
- `create_client(url, key)`: 第1引数にSupabaseのURL、第2引数にAPIキーを取り、`Client` インスタンスを返す


## `azure.cognitiveservices.speech`（外部ライブラリ）
- **概要**: Azure AI Speech を使うための機能をまとめた道具箱
- **インストール**: `pip install azure-cognitiveservices-speech`

### クラス
- `speechsdk.SpeechConfig`
  - **概要**: Azure への接続に必要な情報（APIキー・リージョン）をまとめて持つ
  - **使用例**:
    ```python
    speech_config = speechsdk.SpeechConfig(
        subscription=AZURE_SPEECH_KEY,
        region=AZURE_SPEECH_REGION,
    )
    ```
  - **プロパティ**:
    - `.speech_synthesis_voice_name`: 使用する音声を指定する（例: `"en-US-JennyNeural"`）

- `speechsdk.SpeechSynthesizer`
  - **概要**: テキストを音声に変換する合成エンジン
  - **使用例**:
    ```python
    synthesizer = speechsdk.SpeechSynthesizer(
        speech_config=speech_config,
        audio_config=None,  # None にするとメモリ上でバイト列として生成
    )
    ```
  - **メソッド**:
    - `.speak_text_async(text)`: テキストを音声に変換する非同期リクエストを開始する。`.get()` を呼ぶと結果が返る
  - **結果オブジェクトのプロパティ**:
    - `.reason`: 成功・失敗を示す `ResultReason` の値
    - `.audio_data`: 生成された音声のバイト列
    - `.cancellation_details`: 失敗時の詳細情報

- `speechsdk.ResultReason`
  - **概要**: 音声生成の結果を示す列挙型
  - **値**:
    - `.SynthesizingAudioCompleted`: 音声生成が成功したことを示す

---

## その他

| 用語                | 説明                                                                                         |
| ------------------- | -------------------------------------------------------------------------------------------- |
| コネクションプール  | DBへの接続を事前に複数本作って使い回す仕組み                                                 |
| `_` で始まる変数名  | 「このファイル内部だけで使う変数」という慣習的な意味を持つ                                   |
| `global`            | 関数の外で定義した変数を、関数の中で書き換えるための宣言                                     |
| `$1`, `$2`          | SQLのプレースホルダー（値を安全に埋め込む）                                                  |
| `@` で始まる        | デコレータ（関数に機能を追加する仕組み）                                                     |
| `pyproject.toml`    | Pythonプロジェクトの設定ファイル。このプロジェクトを動かすのに必要なものをTOML形式で記述する |
| JWKS                | JWTが本物かどうかを検証する公開鍵のセットをJSON形式でまとめたもの。Supabaseが持っている      |
| f文字列             | 文字列の中に変数を埋め込むための書き方。文字列の前に `f` をつける                            |
| `async with ... as` | `with` は「処理が終わったら自動で後片付けをする」構文。`async with` はその非同期版           |
| `kid`               | Key IDの略。JWTのヘッダーに含まれる値で、どの公開鍵で署名されたかを示す                      |
| `raise`             | 例外を意図的に発生させるPythonの予約語                                                       |
| ES256               | 楕円曲線暗号（ECDSA）を使ったJWT署名アルゴリズム                                             |
| `audience`          | JWTの受け取り手を検証するパラメータ。Supabaseは `"authenticated"` を使用                     |
