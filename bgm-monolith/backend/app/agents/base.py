from abc import ABC, abstractmethod
from typing import AsyncIterator


class AgentBase(ABC):
    name: str = ""

    @abstractmethod
    async def run(self, query: str, conversation_id: str, **kwargs) -> AsyncIterator[dict]:
        """流式产出事件，每个事件是 {'type': str, 'content': str, ...}"""
        yield {}
