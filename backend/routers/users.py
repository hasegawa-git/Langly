from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel

from auth import get_current_user
from db import get_pool

router = APIRouter(prefix="/users", tags=["users"])


class UserResponse(BaseModel):
    id: str
    email: str
    username: str | None


class UpdateUserRequest(BaseModel):
    username: str


@router.get("/me", response_model=UserResponse)
async def get_me(user: dict = Depends(get_current_user)):
    """
    自分のプロフィールを取得する。
    emailはauth.usersから、usernameはprofilesから取得する。
    """
    user_id = user["sub"]
    pool = await get_pool()

    row = await pool.fetchrow(
        "SELECT username FROM profiles WHERE id = $1",
        user_id,
    )
    if row is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="ユーザーが見つかりません",
        )

    return UserResponse(
        id=user_id,
        email=user.get("email", ""),
        username=row["username"],
    )


@router.patch("/me", response_model=UserResponse)
async def update_me(
    body: UpdateUserRequest,
    user: dict = Depends(get_current_user),
):
    """
    自分のユーザー名を更新する。
    """
    user_id = user["sub"]
    pool = await get_pool()

    row = await pool.fetchrow(
        """
        INSERT INTO profiles (id, username)
        VALUES ($1, $2)
        ON CONFLICT (id) DO UPDATE SET username = $2
        RETURNING username
        """,
        user_id,
        body.username,
    )

    return UserResponse(
        id=user_id,
        email=user.get("email", ""),
        username=row["username"],
    )
