class SqlExecutor:
    """SQL 执行器 — MVP 占位，后续实现。"""

    async def execute(self, sql: str, database: str = "default") -> dict:
        raise NotImplementedError("SqlExecutor not yet implemented")
