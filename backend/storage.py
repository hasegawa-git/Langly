# ライブラリをインポート
import os
import uuid
from supabase import create_client, Client
from dotenv import load_dotenv

# .envファイルから環境変数を読み込む
load_dotenv()

# 環境変数からSupabaseのURLとサービスロールキーを取得
SUPABASE_URL = os.getenv("SUPABASE_URL", "")
SUPABASE_SERVICE_ROLE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY", "")

# ストレージのバケット名を定義
BUCKET_NAME = "audio"

# Supabaseクライアントを保持する変数を定義
_client: Client | None = None

# Supabaseクライアントを返す関数を定義
def get_storage_client() -> Client:
    global _client
    if _client is None:
        _client = create_client(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
    return _client

# 音声データを Supabase Storage にアップロードし、公開URLを返す関数を定義
async def upload_audio(audio_data: bytes) -> str:
    client = get_storage_client()
    file_name = f"{uuid.uuid4()}.mp3" # ファイル名の衝突を防ぐためにUUIDをファイル名に使用

    client.storage.from_(BUCKET_NAME).upload(
        path=file_name,
        file=audio_data,
        file_options={"content-type": "audio/mpeg"},
    )

    url = client.storage.from_(BUCKET_NAME).get_public_url(file_name)
    return url
