import json
from typing import AsyncIterator

from app.agents.base import AgentBase


class OpenClawAgent(AgentBase):
    name = "openclaw"

    @classmethod
    def from_settings(cls, settings) -> "OpenClawAgent":
        return cls(
            api_url=getattr(settings, "openclaw_api_url", "http://localhost:8001"),
            api_key=getattr(settings, "openclaw_api_key", ""),
        )

    def __init__(self, api_url: str, api_key: str):
        self.api_url = api_url
        self.api_key = api_key

    async def run(self, query: str, conversation_id: str, **kwargs) -> AsyncIterator[dict]:
        async for line in self._stream_request(query, conversation_id, **kwargs):
            text = line.decode("utf-8").strip()
            if not text or not text.startswith("data: "):
                continue
            payload = text[6:]  # strip "data: "
            if payload == "[DONE]":
                yield {"type": "done", "content": ""}
                return
            try:
                event = json.loads(payload)
                yield event
            except json.JSONDecodeError:
                continue

    async def _stream_request(self, query: str, conversation_id: str, **kwargs):
        """实际 HTTP SSE 流请求 — 生产环境用 httpx.AsyncClient。"""
        mock_events = [
            json.dumps({"type": "thinking", "content": "正在分析查询..."}).encode(),
            json.dumps({"type": "result", "content": f"分析结果: {query}"}).encode(),
            b"[DONE]",
        ]
        for event in mock_events:
            yield b"data: " + event
