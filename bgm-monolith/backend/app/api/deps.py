# Placeholder dependency functions — will be replaced in Tasks 2-4 with real store implementations
def get_conv_store():
    """Returns conversation store. Override in tests via app.dependency_overrides."""
    from app.storage.factory import get_conversation_store
    return get_conversation_store()


def get_file_store_dep():
    """Returns file store. Override in tests via app.dependency_overrides."""
    from app.storage.factory import get_file_store
    return get_file_store()
