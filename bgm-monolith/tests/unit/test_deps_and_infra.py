"""
回归测试：C1 / C3 / I4
RED → GREEN by TDD
"""
import pytest
from unittest.mock import AsyncMock, MagicMock, patch


# ── C1: get_db 必须在正常退出时调用 commit ──────────────────────────────────
@pytest.mark.asyncio
async def test_get_db_commits_on_success():
    """get_db 在请求正常结束时应调用 session.commit()，否则写入不持久。"""
    mock_session = AsyncMock()
    mock_ctx = AsyncMock()
    mock_ctx.__aenter__ = AsyncMock(return_value=mock_session)
    mock_ctx.__aexit__ = AsyncMock(return_value=False)
    mock_factory = MagicMock(return_value=mock_ctx)

    with patch("app.api.deps._get_engine", return_value=(None, mock_factory)):
        from app.api.deps import get_db
        async for session in get_db():
            assert session is mock_session
    mock_session.commit.assert_called_once()
    mock_session.rollback.assert_not_called()


@pytest.mark.asyncio
async def test_get_db_rollbacks_on_exception():
    """get_db 在请求抛异常时应调用 session.rollback()，不应 commit。

    FastAPI 在 endpoint 抛异常时调用 generator.athrow(exc)，
    此测试模拟该行为。
    """
    mock_session = AsyncMock()
    mock_ctx = AsyncMock()
    mock_ctx.__aenter__ = AsyncMock(return_value=mock_session)
    mock_ctx.__aexit__ = AsyncMock(return_value=False)
    mock_factory = MagicMock(return_value=mock_ctx)

    with patch("app.api.deps._get_engine", return_value=(None, mock_factory)):
        from app.api.deps import get_db
        gen = get_db()
        await gen.__anext__()  # 运行到 yield，获取 session
        with pytest.raises(ValueError):
            await gen.athrow(ValueError("模拟请求中的业务异常"))

    mock_session.rollback.assert_called_once()
    mock_session.commit.assert_not_called()


# ── C3: StreamManager.broadcast 不应抛 NotImplementedError ───────────────────
@pytest.mark.asyncio
async def test_stream_manager_broadcast_is_noop():
    """broadcast 应是 no-op，不抛 NotImplementedError。"""
    from app.core.stream_manager import StreamManager
    mgr = StreamManager()
    await mgr.broadcast("conv-1", {"type": "thinking", "content": "..."})


# ── I4: _msg_to_dict corrupt meta 应记录 warning ─────────────────────────────
@pytest.mark.asyncio
async def test_msg_to_dict_corrupt_meta_logs_warning(caplog):
    """corrupt meta JSON 应记录 warning 而非静默置 None。"""
    import logging
    import datetime
    from app.storage.conversation.mysql_store import _msg_to_dict
    from app.models.conversation import Message

    msg = Message(
        id="test-id",
        conversation_id="conv-1",
        role="assistant",
        content_type="text",
        content="hello",
        meta="{invalid json",
        created_at=datetime.datetime.now(),
    )

    with caplog.at_level(logging.WARNING, logger="app.storage.conversation.mysql_store"):
        result = _msg_to_dict(msg)

    assert result["metadata"] is None
    assert any(
        "meta" in r.message.lower() or "parse" in r.message.lower()
        for r in caplog.records
    ), "期望记录 warning 日志，但未找到相关日志"
