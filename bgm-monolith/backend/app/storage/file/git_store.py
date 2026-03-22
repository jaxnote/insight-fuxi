from app.storage.file.base import FileStoreBase


class GitFileStore(FileStoreBase):
    async def save(self, project_id: str, path: str, content: bytes) -> dict:
        raise NotImplementedError

    async def read(self, project_id: str, path: str) -> bytes:
        raise NotImplementedError

    async def delete(self, project_id: str, path: str) -> bool:
        raise NotImplementedError

    async def list_tree(self, project_id: str) -> list[dict]:
        raise NotImplementedError

    async def move(self, project_id: str, src: str, dst: str) -> bool:
        raise NotImplementedError
