from contextlib import asynccontextmanager

from fastapi import FastAPI

from db import close_pool, get_pool
from routers import users


@asynccontextmanager
async def lifespan(app: FastAPI):
    # 起動時にDBコネクションプールを初期化
    await get_pool()
    yield
    # 終了時にプールを閉じる
    await close_pool()


app = FastAPI(title="Langly API", lifespan=lifespan)

app.include_router(users.router)


@app.get("/health")
async def health():
    return {"status": "ok"}
