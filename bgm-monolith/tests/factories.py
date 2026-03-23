import uuid
from datetime import datetime


class ConversationFactory:
    @staticmethod
    def build(**overrides) -> dict:
        defaults = {
            "id": str(uuid.uuid4()),
            "title": "测试会话",
            "folder": None,
            "pinned": 0,
            "model_name": "gpt-4o",
            "mode": "agent",
            "token_used": 0,
            "token_limit": 128000,
            "created_at": datetime.utcnow().isoformat(),
        }
        defaults.update(overrides)
        return defaults


class MessageFactory:
    @staticmethod
    def build(**overrides) -> dict:
        defaults = {
            "id": str(uuid.uuid4()),
            "role": "user",
            "content_type": "text",
            "content": "上月GMV为什么下降",
            "metadata": None,
            "created_at": datetime.utcnow().isoformat(),
        }
        defaults.update(overrides)
        return defaults


class InMemoryConversationStore:
    """In-memory mock for unit/integration tests."""

    def __init__(self):  # 纯内存，不依赖 DB session
        self._data: dict[str, dict] = {}
        self._messages: dict[str, list] = {}

    async def create(self, title, **kwargs):
        conv = ConversationFactory.build(title=title, **kwargs)
        self._data[conv["id"]] = conv
        self._messages[conv["id"]] = []
        return conv

    async def get(self, conv_id):
        return self._data.get(conv_id)

    async def list_all(self, offset=0, limit=20):
        items = list(self._data.values())
        return items[offset : offset + limit]

    async def update(self, conv_id, **kwargs):
        if conv_id in self._data:
            self._data[conv_id].update(kwargs)
        return self._data.get(conv_id)

    async def delete(self, conv_id):
        return self._data.pop(conv_id, None) is not None

    async def add_message(self, conv_id, role, content_type, content, metadata=None):
        msg = MessageFactory.build(role=role, content_type=content_type, content=content, metadata=metadata)
        self._messages.setdefault(conv_id, []).append(msg)
        return msg

    async def get_messages(self, conv_id):
        return self._messages.get(conv_id, [])

    async def search(self, query):
        return [c for c in self._data.values() if query.lower() in c["title"].lower()]

    async def count(self, query=None):
        if query:
            return len([c for c in self._data.values() if query.lower() in c["title"].lower()])
        return len(self._data)


class InMemoryFileStore:
    """In-memory mock for file storage tests."""

    def __init__(self):
        self._files: dict[str, bytes] = {}

    async def save(self, project_id, path, content):
        key = f"{project_id}/{path}"
        self._files[key] = content
        return {"project_id": project_id, "path": path, "size": len(content)}

    async def read(self, project_id, path):
        return self._files.get(f"{project_id}/{path}", b"")

    async def delete(self, project_id, path):
        return self._files.pop(f"{project_id}/{path}", None) is not None

    async def list_tree(self, project_id):
        prefix = f"{project_id}/"
        return [{"path": k[len(prefix) :]} for k in self._files if k.startswith(prefix)]

    async def move(self, project_id, src, dst):
        key_src = f"{project_id}/{src}"
        if key_src in self._files:
            self._files[f"{project_id}/{dst}"] = self._files.pop(key_src)
            return True
        return False
