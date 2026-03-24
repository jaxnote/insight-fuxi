import logging

logger = logging.getLogger(__name__)


class StreamManager:
    """WebSocket 流式消息管理器 — MVP no-op，待后续接入真实 WS 推送。"""

    async def broadcast(self, conversation_id: str, event: dict) -> None:
        logger.debug(
            "StreamManager.broadcast (no-op): conversation_id=%s type=%s",
            conversation_id,
            event.get("type"),
        )
