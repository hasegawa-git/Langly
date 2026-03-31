# ライブラリをインポート
import os
import httpx
import jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from dotenv import load_dotenv

# .envファイルから環境変数を読み込む
load_dotenv()

# リクエストのAuthorizationヘッダーからBearerトークンを取得する変数を定義
security = HTTPBearer()

# 環境変数からSupabaseのURLを取得
SUPABASE_URL = os.getenv("SUPABASE_URL", "")

# JWKSをキャッシュする変数を定義（初回のみAPIを叩く）
_jwks_cache: dict | None = None

# Supabaseから公開鍵を取得する関数を定義
async def _get_jwks() -> dict:
    global _jwks_cache
    if _jwks_cache is None:
        # SupabaseのJWKSエンドポイントにgetリクエストを送り、公開鍵を取得する
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{SUPABASE_URL}/auth/v1/.well-known/jwks.json"
            )
            _jwks_cache = response.json()
    return _jwks_cache

# JWTトークンが本物かどうかを確認して、ユーザー情報を取り出す関数を定義
async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security),) -> dict:
    # BearerトークンをHTTPAuthorizationCredentialsオブジェクトから取り出す
    token = credentials.credentials
    try:
        # トークンのヘッダーからkidを取得
        header = jwt.get_unverified_header(token)
        kid = header.get("kid")

        # 公開鍵を取得し、JWKSのkeys配列からkidが一致する公開鍵を探す
        jwks = await _get_jwks()
        public_key = None
        for key in jwks.get("keys", []):
            if key.get("kid") == kid:
                public_key = jwt.algorithms.ECAlgorithm.from_jwk(key)
                break

        # ループが終わっても公開鍵が見つからなかった場合はエラーを返す
        if public_key is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="無効なトークンです",
            )

        # トークンを公開鍵で検証し、ペイロード（ユーザー情報）を取得
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