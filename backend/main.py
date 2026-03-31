# ライブラリ・自作関数をインポート
from contextlib import asynccontextmanager
from fastapi import FastAPI
from db import close_pool, get_pool
from routers import users, items, mylist

# アプリの起動時、動作中、終了時の処理（ライフスパン）を定義
@asynccontextmanager
async def lifespan(app: FastAPI):
    await get_pool()   # アプリ起動時(DBプールを初期化)
    yield              # アプリ動作中
    await close_pool() # アプリ終了時(DBプールを閉じる)

# FastAPIクラスからインスタンス(app)を作成
app = FastAPI(title="Langly API", lifespan=lifespan)

# routersディレクトリにて定義したエンドポイントを登録
app.include_router(users.router)
app.include_router(items.router)
app.include_router(mylist.router)

# 動作確認（ヘルスチェック）用のエンドポイントを定義
@app.get("/health")
async def health():
    return {"status": "ok"}