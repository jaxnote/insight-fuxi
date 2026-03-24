import os
from pathlib import Path

import aiofiles

from app.storage.file.base import FileStoreBase


class LocalFileStore(FileStoreBase):
    def __init__(self, base_path: str = None):
        if base_path is None:
            from app.config import settings
            base_path = settings.storage_base_path
        self._base = Path(base_path)

    def _project_dir(self, project_id: str) -> Path:
        return self._base / project_id

    def _full_path(self, project_id: str, path: str) -> Path:
        project_dir = Path(self._base) / project_id
        full = (project_dir / path).resolve()
        if not str(full).startswith(str(project_dir.resolve())):
            raise ValueError(f"非法路径（路径穿越）: {path}")
        return full

    async def save(self, project_id: str, path: str, content: bytes) -> dict:
        full = self._full_path(project_id, path)
        full.parent.mkdir(parents=True, exist_ok=True)
        async with aiofiles.open(full, "wb") as f:
            await f.write(content)
        return {"project_id": project_id, "path": path, "size": len(content)}

    async def read(self, project_id: str, path: str) -> bytes:
        full = self._full_path(project_id, path)
        async with aiofiles.open(full, "rb") as f:
            return await f.read()

    async def delete(self, project_id: str, path: str) -> bool:
        full = self._full_path(project_id, path)
        if full.exists():
            full.unlink()
            return True
        return False

    async def list_tree(self, project_id: str) -> list[dict]:
        project_dir = self._project_dir(project_id)
        if not project_dir.exists():
            return []
        result = []
        for entry in project_dir.rglob("*"):
            if entry.is_file():
                rel = entry.relative_to(project_dir)
                result.append({"path": str(rel)})
        return result

    async def move(self, project_id: str, src: str, dst: str) -> bool:
        src_path = self._full_path(project_id, src)
        dst_path = self._full_path(project_id, dst)
        if not src_path.exists():
            return False
        dst_path.parent.mkdir(parents=True, exist_ok=True)
        src_path.rename(dst_path)
        return True
