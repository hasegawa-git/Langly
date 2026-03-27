from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel

from auth import get_current_user
from db import get_pool

router = APIRouter(tags=["mylist"])


class MylistItemResponse(BaseModel):
    id: UUID
    item_id: UUID
    text: str
    audio_url: str


class AddMylistRequest(BaseModel):
    item_id: UUID


class AddMylistResponse(BaseModel):
    id: UUID
    item_id: UUID


@router.get("/mylist", response_model=list[MylistItemResponse])
async def get_mylist(user: dict = Depends(get_current_user)):
    """
    マイリスト一覧を取得する。
    """
    user_id = user["sub"]
    pool = await get_pool()

    rows = await pool.fetch(
        """
        SELECT m.id, m.item_id, i.text, i.audio_url
        FROM mylist m
        JOIN items i ON m.item_id = i.id
        WHERE m.user_id = $1
        ORDER BY m.added_at DESC
        """,
        user_id,
    )
    return [MylistItemResponse(**dict(row)) for row in rows]


@router.post("/mylist", response_model=AddMylistResponse, status_code=status.HTTP_201_CREATED)
async def add_to_mylist(
    body: AddMylistRequest,
    user: dict = Depends(get_current_user),
):
    """
    マイリストにアイテムを追加する。重複登録は不可。
    """
    user_id = user["sub"]
    pool = await get_pool()

    # アイテムの存在確認
    item = await pool.fetchrow(
        "SELECT id FROM items WHERE id = $1",
        body.item_id,
    )
    if item is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="アイテムが見つかりません")

    # 重複チェック
    existing = await pool.fetchrow(
        "SELECT id FROM mylist WHERE user_id = $1 AND item_id = $2",
        user_id,
        body.item_id,
    )
    if existing is not None:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="すでにマイリストに追加済みです")

    row = await pool.fetchrow(
        """
        INSERT INTO mylist (user_id, item_id)
        VALUES ($1, $2)
        RETURNING id, item_id
        """,
        user_id,
        body.item_id,
    )
    return AddMylistResponse(**dict(row))


@router.delete("/mylist/{mylist_id}", status_code=status.HTTP_204_NO_CONTENT)
async def remove_from_mylist(mylist_id: str, user: dict = Depends(get_current_user)):
    """
    マイリストからアイテムを削除する。
    """
    user_id = user["sub"]
    pool = await get_pool()

    row = await pool.fetchrow(
        "DELETE FROM mylist WHERE id = $1 AND user_id = $2 RETURNING id",
        mylist_id,
        user_id,
    )
    if row is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="マイリストアイテムが見つかりません")
