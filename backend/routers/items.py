from datetime import datetime
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel

from auth import get_current_user
from db import get_pool
from speech import text_to_speech
from storage import upload_audio

router = APIRouter(tags=["items"])


class ItemResponse(BaseModel):
    id: UUID
    text: str
    audio_url: str
    created_at: datetime


class CreateItemRequest(BaseModel):
    text: str


class UpdateItemRequest(BaseModel):
    text: str


# ---- /items ----

@router.get("/items", response_model=list[ItemResponse])
async def get_items(user: dict = Depends(get_current_user)):
    """
    自分の学習アイテム一覧を取得する。
    """
    user_id = user["sub"]
    pool = await get_pool()

    rows = await pool.fetch(
        "SELECT id, text, audio_url, created_at FROM items WHERE user_id = $1 ORDER BY created_at DESC",
        user_id,
    )
    return [ItemResponse(**dict(row)) for row in rows]


@router.post("/items", response_model=ItemResponse, status_code=status.HTTP_201_CREATED)
async def create_item(
    body: CreateItemRequest,
    user: dict = Depends(get_current_user),
):
    """
    テキストから音声を生成し、学習アイテムを作成する。
    """
    user_id = user["sub"]

    # 音声生成・アップロード
    audio_data = await text_to_speech(body.text)
    audio_url = await upload_audio(audio_data)

    pool = await get_pool()
    row = await pool.fetchrow(
        """
        INSERT INTO items (user_id, text, audio_url)
        VALUES ($1, $2, $3)
        RETURNING id, text, audio_url, created_at
        """,
        user_id,
        body.text,
        audio_url,
    )
    return ItemResponse(**dict(row))


@router.get("/items/{item_id}", response_model=ItemResponse)
async def get_item(item_id: str, user: dict = Depends(get_current_user)):
    """
    学習アイテム詳細を取得する。他人のアイテムは取得不可。
    """
    user_id = user["sub"]
    pool = await get_pool()

    row = await pool.fetchrow(
        "SELECT id, text, audio_url, created_at FROM items WHERE id = $1 AND user_id = $2",
        item_id,
        user_id,
    )
    if row is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="アイテムが見つかりません")
    return ItemResponse(**dict(row))


@router.patch("/items/{item_id}", response_model=ItemResponse)
async def update_item(
    item_id: str,
    body: UpdateItemRequest,
    user: dict = Depends(get_current_user),
):
    """
    テキストを更新し、音声を自動再生成する。
    """
    user_id = user["sub"]
    pool = await get_pool()

    # 自分のアイテムか確認
    existing = await pool.fetchrow(
        "SELECT id FROM items WHERE id = $1 AND user_id = $2",
        item_id,
        user_id,
    )
    if existing is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="アイテムが見つかりません")

    # 音声再生成・アップロード
    audio_data = await text_to_speech(body.text)
    audio_url = await upload_audio(audio_data)

    row = await pool.fetchrow(
        """
        UPDATE items SET text = $1, audio_url = $2
        WHERE id = $3
        RETURNING id, text, audio_url, created_at
        """,
        body.text,
        audio_url,
        item_id,
    )
    return ItemResponse(**dict(row))


@router.delete("/items/{item_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_item(item_id: str, user: dict = Depends(get_current_user)):
    """
    学習アイテムを削除する。
    """
    user_id = user["sub"]
    pool = await get_pool()

    row = await pool.fetchrow(
        "DELETE FROM items WHERE id = $1 AND user_id = $2 RETURNING id",
        item_id,
        user_id,
    )
    if row is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="アイテムが見つかりません")


# ---- /library ----

@router.get("/library", response_model=list[ItemResponse])
async def get_library():
    """
    ライブラリアイテム一覧を取得する。認証不要。
    """
    pool = await get_pool()

    rows = await pool.fetch(
        "SELECT id, text, audio_url, created_at FROM items WHERE user_id IS NULL ORDER BY created_at DESC",
    )
    return [ItemResponse(**dict(row)) for row in rows]
