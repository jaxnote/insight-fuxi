import pytest
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from httpx import AsyncClient, ASGITransport
import app.models  # noqa: F401 — ensure all ORM models are registered before create_all
from app.models.base import Base
from app.main import app
from app.api.deps import get_conv_store, get_file_store_dep
from app.api.projects.projects import get_project_store, InMemoryProjectStore

# SQLite in-memory for tests (fast, no external DB needed)
TEST_DB_URL = "sqlite+aiosqlite:///:memory:"


@pytest.fixture
async def db_engine():
    engine = create_async_engine(TEST_DB_URL)
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield engine
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
    await engine.dispose()


@pytest.fixture
async def db_session(db_engine):
    session_factory = async_sessionmaker(db_engine, class_=AsyncSession, expire_on_commit=False)
    async with session_factory() as session:
        yield session


@pytest.fixture
async def client(db_session):
    """FastAPI TestClient with dependency overrides."""
    from tests.factories import InMemoryConversationStore, InMemoryFileStore

    conv_store = InMemoryConversationStore()
    file_store = InMemoryFileStore()
    proj_store = InMemoryProjectStore()

    app.dependency_overrides[get_conv_store] = lambda: conv_store
    app.dependency_overrides[get_file_store_dep] = lambda: file_store
    app.dependency_overrides[get_project_store] = lambda: proj_store

    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as c:
        yield c

    app.dependency_overrides.clear()
