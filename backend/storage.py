import os
import uuid
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL", "")
SUPABASE_SERVICE_ROLE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY", "")

BUCKET_NAME = "audio"

_client: Client | None = None


def get_storage_client() -> Client:
    """
    Supabase クライアントを返す。
    未作成の場合は新規作成する。
    """
    global _client
    if _client is None:
        _client = create_client(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
    return _client


async def upload_audio(audio_data: bytes) -> str:
    """
    音声データを Supabase Storage にアップロードし、公開URLを返す。
    ファイル名はUUIDで生成する。
    """
    client = get_storage_client()
    file_name = f"{uuid.uuid4()}.mp3"

    client.storage.from_(BUCKET_NAME).upload(
        path=file_name,
        file=audio_data,
        file_options={"content-type": "audio/mpeg"},
    )

    url = client.storage.from_(BUCKET_NAME).get_public_url(file_name)
    return url
