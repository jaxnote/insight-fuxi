# Placeholder dependency functions — will be replaced in Tasks 2-4 with real store implementations
def get_conv_store():
    """Returns conversation store. Override in tests via app.dependency_overrides."""
    raise NotImplementedError("No store configured")


def get_file_store_dep():
    """Returns file store. Override in tests via app.dependency_overrides."""
    raise NotImplementedError("No store configured")
