from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env")

    app_name: str = "insight-fuxi"
    version: str = "0.1.0"
    debug: bool = False
    database_url: str = "sqlite+aiosqlite:///./dev.db"

    conversation_backend: str = "mysql"
    file_backend: str = "local"
    storage_base_path: str = "./storage"

    openclaw_api_url: str = "http://localhost:8001"
    openclaw_api_key: str = ""
    # True = 使用内置 mock 事件（开发/测试），False = 调用真实 OpenClaw API
    mock_agent: bool = True


settings = Settings()
