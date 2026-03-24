class AgentRegistry:
    def __init__(self):
        self._agents: dict[str, type] = {}

    def register(self, name: str, agent_cls: type) -> None:
        self._agents[name] = agent_cls

    def get(self, name: str) -> type:
        if name not in self._agents:
            raise KeyError(f"Agent '{name}' not registered. Available: {list(self._agents)}")
        return self._agents[name]

    def list_agents(self) -> list[str]:
        return list(self._agents.keys())
