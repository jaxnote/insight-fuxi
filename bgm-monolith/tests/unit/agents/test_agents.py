import pytest
from unittest.mock import AsyncMock, patch


# ===== AgentRegistry 测试 =====

def test_registry_register_and_get():
    from app.agents.registry import AgentRegistry
    from app.agents.base import AgentBase

    class MockAgent(AgentBase):
        name = "mock"
        async def run(self, query: str, conversation_id: str, **kwargs):
            yield {"type": "done", "content": "ok"}

    registry = AgentRegistry()
    registry.register("mock", MockAgent)
    agent_cls = registry.get("mock")
    assert agent_cls is MockAgent

def test_registry_get_unknown_raises():
    from app.agents.registry import AgentRegistry
    registry = AgentRegistry()
    with pytest.raises(KeyError):
        registry.get("nonexistent")

def test_registry_list_agents():
    from app.agents.registry import AgentRegistry
    from app.agents.base import AgentBase

    class AgentA(AgentBase):
        name = "agent_a"
        async def run(self, query, conversation_id, **kwargs): yield {}

    registry = AgentRegistry()
    registry.register("agent_a", AgentA)
    assert "agent_a" in registry.list_agents()


# ===== OpenClaw Agent 测试 =====

@pytest.mark.asyncio
async def test_openclaw_agent_run_streams_events():
    """OpenClaw agent 应流式产出 thinking/result/done 事件。"""
    from app.agents.openclaw_agent import OpenClawAgent

    agent = OpenClawAgent(api_url="http://mock-openclaw", api_key="test-key", mock_mode=True)

    # Mock HTTP 流式响应
    mock_lines = [
        'data: {"type": "thinking", "content": "分析中..."}',
        'data: {"type": "result", "content": "GMV下降10%"}',
        'data: [DONE]',
    ]

    async def mock_stream(*args, **kwargs):
        for line in mock_lines:
            yield line.encode()

    with patch.object(agent, "_stream_request", mock_stream):
        events = []
        async for event in agent.run("GMV为什么下降", conversation_id="conv-1"):
            events.append(event)

    assert any(e["type"] == "thinking" for e in events)
    assert any(e["type"] == "result" for e in events)
    assert any(e["type"] == "done" for e in events)


# ── C1: mock_mode 隔离验证 ────────────────────────────────────────────────────

@pytest.mark.asyncio
async def test_openclaw_agent_mock_mode_returns_mock_events():
    """mock_mode=True 时返回内置 mock 事件（开发/测试环境）。"""
    from app.agents.openclaw_agent import OpenClawAgent

    agent = OpenClawAgent(api_url="http://any", api_key="", mock_mode=True)
    events = []
    async for event in agent.run("test query", conversation_id="conv-1"):
        events.append(event)

    assert len(events) > 0
    assert any(e["type"] == "done" for e in events)


@pytest.mark.asyncio
async def test_openclaw_agent_raises_not_implemented_when_mock_disabled():
    """mock_mode=False 时应明确抛出 NotImplementedError，而非静默返回假数据。"""
    from app.agents.openclaw_agent import OpenClawAgent

    agent = OpenClawAgent(api_url="http://real-server", api_key="key", mock_mode=False)
    with pytest.raises(NotImplementedError, match="httpx"):
        async for _ in agent.run("test query", conversation_id="conv-1"):
            pass


@pytest.mark.asyncio
async def test_openclaw_agent_from_settings_respects_mock_mode():
    """from_settings() 应从 settings.mock_agent 读取 mock_mode。"""
    from app.agents.openclaw_agent import OpenClawAgent
    from unittest.mock import MagicMock

    mock_settings = MagicMock()
    mock_settings.openclaw_api_url = "http://test"
    mock_settings.openclaw_api_key = "key"
    mock_settings.mock_agent = False

    agent = OpenClawAgent.from_settings(mock_settings)
    assert agent.mock_mode is False


# ===== AgentGateway 测试 =====

@pytest.mark.asyncio
async def test_gateway_dispatch_to_registered_agent():
    """Gateway 应能正确分发到已注册的 Agent。"""
    from app.core.agent_gateway import AgentGateway
    from app.agents.base import AgentBase

    events_received = []

    class EchoAgent(AgentBase):
        name = "echo"
        async def run(self, query, conversation_id, **kwargs):
            yield {"type": "result", "content": query}
            yield {"type": "done", "content": ""}

    gateway = AgentGateway()
    gateway.registry.register("echo", EchoAgent)

    async for event in gateway.dispatch("hello", conversation_id="c1", agent_name="echo"):
        events_received.append(event)

    assert events_received[0]["content"] == "hello"
    assert events_received[-1]["type"] == "done"

@pytest.mark.asyncio
async def test_gateway_dispatch_unknown_agent_raises():
    from app.core.agent_gateway import AgentGateway
    gateway = AgentGateway()
    with pytest.raises(KeyError):
        async for _ in gateway.dispatch("q", conversation_id="c1", agent_name="unknown"):
            pass
