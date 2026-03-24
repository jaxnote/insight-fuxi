"""
I4 回归测试：MessageCreate 枚举校验（精确断言到字段）
RED → GREEN by TDD
"""
import pytest
from pydantic import ValidationError


def _error_locs(exc: ValidationError) -> list[str]:
    """提取 ValidationError 中所有错误字段名。"""
    return [str(e["loc"][0]) for e in exc.value.errors() if e["loc"]]


# ── 已有回归测试（精化：精确断言到字段）────────────────────────────────────

def test_message_create_rejects_invalid_role():
    """MessageCreate.role 应只接受 'user'/'assistant'，拒绝任意字符串。"""
    from app.api.nl_analysis.schemas import MessageCreate

    with pytest.raises(ValidationError) as exc:
        MessageCreate(role="admin", content_type="text", content="hello")

    assert "role" in _error_locs(exc), f"期望 role 字段触发错误，实际: {exc.value.errors()}"


def test_message_create_rejects_invalid_content_type():
    """MessageCreate.content_type 应只接受枚举值，拒绝任意字符串。"""
    from app.api.nl_analysis.schemas import MessageCreate

    with pytest.raises(ValidationError) as exc:
        MessageCreate(role="user", content_type="video", content="hello")

    assert "content_type" in _error_locs(exc), (
        f"期望 content_type 字段触发错误，实际: {exc.value.errors()}"
    )


def test_message_create_accepts_valid_role_user():
    from app.api.nl_analysis.schemas import MessageCreate
    msg = MessageCreate(role="user", content="hello")
    assert msg.role == "user"


def test_message_create_accepts_valid_role_assistant():
    from app.api.nl_analysis.schemas import MessageCreate
    msg = MessageCreate(role="assistant", content="world")
    assert msg.role == "assistant"


def test_message_create_accepts_all_valid_content_types():
    from app.api.nl_analysis.schemas import MessageCreate
    for ct in ("text", "markdown", "sql", "image"):
        msg = MessageCreate(role="user", content_type=ct, content="x")
        assert msg.content_type == ct


# ── 测试缺口补全：content 空字符串应触发 ValidationError ─────────────────────

def test_message_create_rejects_empty_content():
    """MessageCreate.content 为空字符串时应触发 ValidationError（min_length=1）。"""
    from app.api.nl_analysis.schemas import MessageCreate

    with pytest.raises(ValidationError) as exc:
        MessageCreate(role="user", content_type="text", content="")

    assert "content" in _error_locs(exc), (
        f"期望 content 字段触发错误，实际: {exc.value.errors()}"
    )
