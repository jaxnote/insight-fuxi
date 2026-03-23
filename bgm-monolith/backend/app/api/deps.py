from typing import AsyncGenerator

from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine

from app.config import settings

# ---------------------------------------------------------------------------
# DB engine & session factory (lazy-init to avoid import-time side effects)
# ---------------------------------------------------------------------------
_engine = None
_session_factory = None


def _get_engine():
    global _engine, _session_factory
    if _engine is None:
        _engine = create_async_engine(
            settings.database_url,
            echo=settings.debug,
            pool_pre_ping=True,
        )
        _session_factory = async_sessionmaker(_engine, class_=AsyncSession, expire_on_commit=False)
    return _engine, _session_factory


async def get_db() -> AsyncGenerator[AsyncSession, None]:
    _, session_factory = _get_engine()
    async with session_factory() as session:
        yield session


async def get_conv_store(session: AsyncSession = Depends(get_db)):
    from app.storage.factory import get_conversation_store
    return get_conversation_store(session)


def get_file_store_dep():
    """Returns file store. Override in tests via app.dependency_overrides."""
    from app.storage.factory import get_file_store
    return get_file_store()
