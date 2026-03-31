# ライブラリ・自作関数をインポート
import os
import asyncpg
from dotenv import load_dotenv

# .envファイルから環境変数を読み込む
load_dotenv()

# 環境変数からDB接続URLを取得
DATABASE_URL = os.getenv("DATABASE_URL", "")

# コネクションプールを保持する変数を定義
_pool: asyncpg.Pool | None = None

# プールを返す、もしくは作る関数を定義
async def get_pool() -> asyncpg.Pool:
    global _pool
    if _pool is None:
        _pool = await asyncpg.create_pool(DATABASE_URL)
    return _pool

# プールを閉じる関数を定義
async def close_pool() -> None:
    global _pool
    if _pool is not None:
        await _pool.close()
        _pool = None
