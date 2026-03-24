from app.storage.conversation.base import ConversationStoreBase


class EsConversationStore(ConversationStoreBase):
    async def create(self, title: str, **kwargs) -> dict:
        raise NotImplementedError

    async def get(self, conv_id: str) -> dict | None:
        raise NotImplementedError

    async def list_all(self, offset: int = 0, limit: int = 20) -> list[dict]:
        raise NotImplementedError

    async def update(self, conv_id: str, **kwargs) -> dict | None:
        raise NotImplementedError

    async def delete(self, conv_id: str) -> bool:
        raise NotImplementedError

    async def add_message(
        self,
        conv_id: str,
        role: str,
        content_type: str,
        content: str,
        metadata: dict | None = None,
    ) -> dict:
        raise NotImplementedError

    async def get_messages(self, conv_id: str) -> list[dict]:
        raise NotImplementedError

    async def search(self, query: str) -> list[dict]:
        raise NotImplementedError
