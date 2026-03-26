import os
import asyncpg
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL", "")

_pool: asyncpg.Pool | None = None


async def get_pool() -> asyncpg.Pool:
    """
    コネクションプールを返す。
    未作成の場合は新規作成する。
    """
    global _pool
    if _pool is None:
        _pool = await asyncpg.create_pool(DATABASE_URL)
    return _pool


async def close_pool() -> None:
    """
    コネクションプールを閉じる。
    """
    global _pool
    if _pool is not None:
        await _pool.close()
        _pool = None
