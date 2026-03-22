import uuid
from datetime import datetime, UTC
from fastapi import APIRouter, HTTPException, Depends
from app.api.projects.schemas import ProjectCreate, ProjectOut, ProjectListOut


class InMemoryProjectStore:
    def __init__(self):
        self._data: dict[str, dict] = {}

    def create(self, name: str, description: str | None = None) -> dict:
        proj = {
            "id": str(uuid.uuid4()),
            "name": name,
            "description": description,
            "created_at": datetime.now(UTC).isoformat(),
        }
        self._data[proj["id"]] = proj
        return proj

    def get(self, proj_id: str) -> dict | None:
        return self._data.get(proj_id)

    def list_all(self) -> list[dict]:
        return list(self._data.values())


router = APIRouter(prefix="/projects")

# MVP: 进程内共享的内存项目存储。生产环境应替换为数据库实现。
_default_project_store = InMemoryProjectStore()


def get_project_store() -> InMemoryProjectStore:
    """返回项目存储。测试中通过 app.dependency_overrides 替换。"""
    return _default_project_store


@router.post("", status_code=201, response_model=ProjectOut)
async def create_project(body: ProjectCreate, store: InMemoryProjectStore = Depends(get_project_store)):
    proj = store.create(name=body.name, description=body.description)
    return proj


@router.get("", response_model=ProjectListOut)
async def list_projects(store: InMemoryProjectStore = Depends(get_project_store)):
    items = store.list_all()
    return {"items": items, "total": len(items)}


@router.get("/{proj_id}", response_model=ProjectOut)
async def get_project(proj_id: str, store: InMemoryProjectStore = Depends(get_project_store)):
    proj = store.get(proj_id)
    if proj is None:
        raise HTTPException(status_code=404, detail="Project not found")
    return proj
