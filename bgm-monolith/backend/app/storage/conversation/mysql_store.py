import json
import uuid

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.conversation import Conversation, Message
from app.storage.conversation.base import ConversationStoreBase


def _conv_to_dict(conv: Conversation) -> dict:
    return {
        "id": conv.id,
        "title": conv.title,
        "folder": conv.folder,
        "pinned": conv.pinned,
        "model_name": conv.model_name,
        "mode": conv.mode,
        "token_used": conv.token_used,
        "token_limit": conv.token_limit,
        "created_at": conv.created_at.isoformat(),
    }


def _msg_to_dict(msg: Message) -> dict:
    try:
        meta = json.loads(msg.meta) if msg.meta else None
    except (json.JSONDecodeError, TypeError):
        meta = None
    return {
        "id": msg.id,
        "conversation_id": msg.conversation_id,
        "role": msg.role,
        "content_type": msg.content_type,
        "content": msg.content,
        "metadata": meta,
        "created_at": msg.created_at.isoformat(),
    }


ALLOWED_UPDATE_FIELDS = {"title", "folder", "pinned", "model_name", "mode", "token_used", "token_limit"}


class MySQLConversationStore(ConversationStoreBase):
    def __init__(self, session: AsyncSession):
        self._session = session

    async def create(self, title: str, **kwargs) -> dict:
        conv = Conversation(id=str(uuid.uuid4()), title=title, **kwargs)
        self._session.add(conv)
        await self._session.flush()
        await self._session.refresh(conv)
        return _conv_to_dict(conv)

    async def get(self, conv_id: str) -> dict | None:
        result = await self._session.get(Conversation, conv_id)
        return _conv_to_dict(result) if result else None

    async def list_all(self, offset: int = 0, limit: int = 20) -> list[dict]:
        stmt = (
            select(Conversation)
            .order_by(Conversation.pinned.desc(), Conversation.created_at.desc())
            .offset(offset)
            .limit(limit)
        )
        rows = (await self._session.execute(stmt)).scalars().all()
        return [_conv_to_dict(r) for r in rows]

    async def update(self, conv_id: str, **kwargs) -> dict | None:
        invalid = set(kwargs) - ALLOWED_UPDATE_FIELDS
        if invalid:
            raise ValueError(f"不允许更新的字段: {invalid}")
        conv = await self._session.get(Conversation, conv_id)
        if conv is None:
            return None
        for key, value in kwargs.items():
            setattr(conv, key, value)
        await self._session.flush()
        await self._session.refresh(conv)
        return _conv_to_dict(conv)

    async def delete(self, conv_id: str) -> bool:
        conv = await self._session.get(Conversation, conv_id)
        if conv is None:
            return False
        await self._session.delete(conv)
        await self._session.flush()
        return True

    async def add_message(
        self,
        conv_id: str,
        role: str,
        content_type: str,
        content: str,
        metadata: dict | None = None,
    ) -> dict:
        msg = Message(
            id=str(uuid.uuid4()),
            conversation_id=conv_id,
            role=role,
            content_type=content_type,
            content=content,
            meta=json.dumps(metadata) if metadata else None,
        )
        self._session.add(msg)
        await self._session.flush()
        await self._session.refresh(msg)
        return _msg_to_dict(msg)

    async def get_messages(self, conv_id: str) -> list[dict]:
        stmt = select(Message).where(Message.conversation_id == conv_id).order_by(Message.created_at)
        rows = (await self._session.execute(stmt)).scalars().all()
        return [_msg_to_dict(r) for r in rows]

    async def search(self, query: str) -> list[dict]:
        stmt = select(Conversation).where(Conversation.title.ilike(f"%{query}%"))
        rows = (await self._session.execute(stmt)).scalars().all()
        return [_conv_to_dict(r) for r in rows]
