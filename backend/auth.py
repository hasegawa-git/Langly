import os
import httpx
import jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from dotenv import load_dotenv

load_dotenv()

security = HTTPBearer()

SUPABASE_URL = os.getenv("SUPABASE_URL", "")

# JWKSをキャッシュする
_jwks_cache: dict | None = None


async def _get_jwks() -> dict:
    """
    SupabaseのJWKSエンドポイントから公開鍵を取得する。
    取得後はキャッシュして再利用する。
    """
    global _jwks_cache
    if _jwks_cache is None:
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{SUPABASE_URL}/auth/v1/.well-known/jwks.json"
            )
            _jwks_cache = response.json()
    return _jwks_cache


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
) -> dict:
    """
    AuthorizationヘッダーのJWTトークンを検証し、ユーザー情報を返す。
    認証が必要なエンドポイントでDependsとして使用する。
    """
    token = credentials.credentials
    try:
        # トークンのヘッダーからkidを取得
        header = jwt.get_unverified_header(token)
        kid = header.get("kid")

        # JWKSから対応する公開鍵を探す
        jwks = await _get_jwks()
        public_key = None
        for key in jwks.get("keys", []):
            if key.get("kid") == kid:
                public_key = jwt.algorithms.ECAlgorithm.from_jwk(key)
                break

        if public_key is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="無効なトークンです",
            )

        payload = jwt.decode(
            token,
            public_key,
            algorithms=["ES256"],
            audience="authenticated",
        )
        return payload

    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="トークンの有効期限が切れています",
        )
    except jwt.InvalidTokenError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="無効なトークンです",
        )
