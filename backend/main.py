from fastapi import FastAPI

app = FastAPI(title="Langly API")


@app.get("/health")
async def health():
    return {"status": "ok"}
