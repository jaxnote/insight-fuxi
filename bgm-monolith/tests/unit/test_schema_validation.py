"""
I4 回归测试：MessageCreate 枚举校验
RED → GREEN by TDD
"""
import pytest
from pydantic import ValidationError


# ── I4-New: MessageCreate.role 应拒绝无效值 ──────────────────────────────────
def test_message_create_rejects_invalid_role():
    """MessageCreate.role 应只接受 'user' 或 'assistant'，拒绝任意字符串。"""
    from app.api.nl_analysis.schemas import MessageCreate

    with pytest.raises(ValidationError):
        MessageCreate(role="admin", content_type="text", content="hello")


def test_message_create_rejects_invalid_content_type():
    """MessageCreate.content_type 应只接受枚举值，拒绝任意字符串。"""
    from app.api.nl_analysis.schemas import MessageCreate

    with pytest.raises(ValidationError):
        MessageCreate(role="user", content_type="video", content="hello")


def test_message_create_accepts_valid_role_user():
    """MessageCreate 应接受合法的 role='user'。"""
    from app.api.nl_analysis.schemas import MessageCreate

    msg = MessageCreate(role="user", content="hello")
    assert msg.role == "user"


def test_message_create_accepts_valid_role_assistant():
    """MessageCreate 应接受合法的 role='assistant'。"""
    from app.api.nl_analysis.schemas import MessageCreate

    msg = MessageCreate(role="assistant", content="world")
    assert msg.role == "assistant"


def test_message_create_accepts_all_valid_content_types():
    """MessageCreate 应接受所有合法的 content_type 枚举值。"""
    from app.api.nl_analysis.schemas import MessageCreate

    for ct in ("text", "markdown", "sql", "image"):
        msg = MessageCreate(role="user", content_type=ct, content="x")
        assert msg.content_type == ct
