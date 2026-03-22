from typing import AsyncIterator

from app.agents.registry import AgentRegistry
from app.agents.openclaw_agent import OpenClawAgent
from app.config import settings


class AgentGateway:
    def __init__(self):
        self.registry = AgentRegistry()
        self._setup_default_agents()

    def _setup_default_agents(self):
        self.registry.register("openclaw", OpenClawAgent)

    async def dispatch(
        self, query: str, conversation_id: str, agent_name: str = "openclaw", **kwargs
    ) -> AsyncIterator[dict]:
        agent_cls = self.registry.get(agent_name)
        if hasattr(agent_cls, "from_settings"):
            agent = agent_cls.from_settings(settings)
        else:
            agent = agent_cls()
        async for event in agent.run(query, conversation_id, **kwargs):
            yield event
