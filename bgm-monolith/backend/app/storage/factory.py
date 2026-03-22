from app.config import settings


def get_conversation_store(session=None):
    backend = getattr(settings, "conversation_backend", "mysql")
    if backend == "mysql":
        from app.storage.conversation.mysql_store import MySQLConversationStore
        return MySQLConversationStore(session)
    raise ValueError(f"Unknown conversation backend: {backend}")


def get_file_store():
    backend = getattr(settings, "file_backend", "local")
    if backend == "local":
        from app.storage.file.local_store import LocalFileStore
        return LocalFileStore()
    raise ValueError(f"Unknown file backend: {backend}")
