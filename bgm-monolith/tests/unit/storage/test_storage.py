import pytest


# ===== ConversationStore 测试 =====

async def test_conv_store_create(db_session):
    from app.storage.conversation.mysql_store import MySQLConversationStore
    store = MySQLConversationStore(db_session)
    conv = await store.create(title="测试会话")
    assert conv["title"] == "测试会话"
    assert "id" in conv


async def test_conv_store_get(db_session):
    from app.storage.conversation.mysql_store import MySQLConversationStore
    store = MySQLConversationStore(db_session)
    conv = await store.create(title="get测试")
    result = await store.get(conv["id"])
    assert result is not None
    assert result["title"] == "get测试"


async def test_conv_store_list_all(db_session):
    from app.storage.conversation.mysql_store import MySQLConversationStore
    store = MySQLConversationStore(db_session)
    await store.create(title="会话1")
    await store.create(title="会话2")
    items = await store.list_all()
    assert len(items) == 2


async def test_conv_store_update(db_session):
    from app.storage.conversation.mysql_store import MySQLConversationStore
    store = MySQLConversationStore(db_session)
    conv = await store.create(title="旧标题")
    updated = await store.update(conv["id"], title="新标题", pinned=1)
    assert updated["title"] == "新标题"
    assert updated["pinned"] == 1


async def test_conv_store_delete(db_session):
    from app.storage.conversation.mysql_store import MySQLConversationStore
    store = MySQLConversationStore(db_session)
    conv = await store.create(title="待删除")
    result = await store.delete(conv["id"])
    assert result is True
    assert await store.get(conv["id"]) is None


async def test_conv_store_add_message(db_session):
    from app.storage.conversation.mysql_store import MySQLConversationStore
    store = MySQLConversationStore(db_session)
    conv = await store.create(title="消息测试")
    msg = await store.add_message(conv["id"], role="user", content_type="text", content="你好")
    assert msg["role"] == "user"
    assert msg["content"] == "你好"


async def test_conv_store_get_messages(db_session):
    from app.storage.conversation.mysql_store import MySQLConversationStore
    store = MySQLConversationStore(db_session)
    conv = await store.create(title="消息列表")
    await store.add_message(conv["id"], "user", "text", "消息1")
    await store.add_message(conv["id"], "assistant", "text", "消息2")
    messages = await store.get_messages(conv["id"])
    assert len(messages) == 2


async def test_conv_store_search(db_session):
    from app.storage.conversation.mysql_store import MySQLConversationStore
    store = MySQLConversationStore(db_session)
    await store.create(title="GMV分析")
    await store.create(title="渠道ROI")
    results = await store.search("GMV")
    assert len(results) == 1
    assert results[0]["title"] == "GMV分析"


# ===== FileStore 测试 =====

async def test_file_store_save_and_read(tmp_path):
    from app.storage.file.local_store import LocalFileStore
    store = LocalFileStore(base_path=str(tmp_path))
    result = await store.save("proj1", "report.md", b"# report")
    assert result["path"] == "report.md"
    content = await store.read("proj1", "report.md")
    assert content == b"# report"


async def test_file_store_delete(tmp_path):
    from app.storage.file.local_store import LocalFileStore
    store = LocalFileStore(base_path=str(tmp_path))
    await store.save("proj1", "to_delete.txt", b"data")
    result = await store.delete("proj1", "to_delete.txt")
    assert result is True


async def test_file_store_list_tree(tmp_path):
    from app.storage.file.local_store import LocalFileStore
    store = LocalFileStore(base_path=str(tmp_path))
    await store.save("proj1", "a.md", b"a")
    await store.save("proj1", "b.md", b"b")
    tree = await store.list_tree("proj1")
    paths = [item["path"] for item in tree]
    assert "a.md" in paths
    assert "b.md" in paths


async def test_file_store_move(tmp_path):
    from app.storage.file.local_store import LocalFileStore
    store = LocalFileStore(base_path=str(tmp_path))
    await store.save("proj1", "old.md", b"content")
    result = await store.move("proj1", "old.md", "new.md")
    assert result is True
    content = await store.read("proj1", "new.md")
    assert content == b"content"


# ===== StorageFactory 测试 =====

def test_factory_returns_mysql_store():
    from app.storage.factory import get_conversation_store
    from app.storage.conversation.mysql_store import MySQLConversationStore
    store = get_conversation_store(session=None)
    assert isinstance(store, MySQLConversationStore)


def test_factory_returns_local_file_store():
    from app.storage.factory import get_file_store
    from app.storage.file.local_store import LocalFileStore
    store = get_file_store()
    assert isinstance(store, LocalFileStore)
