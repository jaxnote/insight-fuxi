from abc import ABC, abstractmethod


class FileStoreBase(ABC):
    @abstractmethod
    async def save(self, project_id: str, path: str, content: bytes) -> dict: ...

    @abstractmethod
    async def read(self, project_id: str, path: str) -> bytes: ...

    @abstractmethod
    async def delete(self, project_id: str, path: str) -> bool: ...

    @abstractmethod
    async def list_tree(self, project_id: str) -> list[dict]: ...

    @abstractmethod
    async def move(self, project_id: str, src: str, dst: str) -> bool: ...
