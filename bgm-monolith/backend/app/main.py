import app.models  # noqa: F401 — register all ORM models before create_all
from fastapi import FastAPI
from app.config import settings
from app.api.router import api_router
from app.models.base import Base

app = FastAPI(
    title=settings.app_name,
    version=settings.version,
    debug=settings.debug,
)

app.include_router(api_router, prefix="/api")


@app.on_event("startup")
async def startup():
    """Auto-create all DB tables on first run (dev convenience; use Alembic for prod migrations)."""
    from app.api.deps import _get_engine
    engine, _ = _get_engine()
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)


@app.get("/health")
async def health():
    return {"status": "ok", "version": settings.version}
