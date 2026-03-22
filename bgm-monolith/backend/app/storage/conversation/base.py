from abc import ABC, abstractmethod


class ConversationStoreBase(ABC):
    @abstractmethod
    async def create(self, title: str, **kwargs) -> dict: ...

    @abstractmethod
    async def get(self, conv_id: str) -> dict | None: ...

    @abstractmethod
    async def list_all(self, offset: int = 0, limit: int = 20) -> list[dict]: ...

    @abstractmethod
    async def update(self, conv_id: str, **kwargs) -> dict | None: ...

    @abstractmethod
    async def delete(self, conv_id: str) -> bool: ...

    @abstractmethod
    async def add_message(
        self,
        conv_id: str,
        role: str,
        content_type: str,
        content: str,
        metadata: dict | None = None,
    ) -> dict: ...

    @abstractmethod
    async def get_messages(self, conv_id: str) -> list[dict]: ...

    @abstractmethod
    async def search(self, query: str) -> list[dict]: ...
