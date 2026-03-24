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


# ── I2-New: LIKE 查询应转义用户输入中的通配符 ──────────────────────────────
async def test_conv_store_search_escapes_percent_wildcard(db_session):
    """搜索字符串中的 % 不应被 SQL 当作通配符，只匹配字面含 % 的标题。"""
    from app.storage.conversation.mysql_store import MySQLConversationStore
    store = MySQLConversationStore(db_session)
    await store.create(title="GMV增长50%")   # 包含字面 %
    await store.create(title="GMV增长50元")  # 不含 %
    results = await store.search("50%")
    assert len(results) == 1, (
        f"搜索 '50%' 应只返回字面包含 '50%' 的记录，实际返回 {len(results)} 条"
    )
    assert results[0]["title"] == "GMV增长50%"


async def test_conv_store_search_escapes_underscore_wildcard(db_session):
    """搜索字符串中的 _ 不应被 SQL 当作单字符通配符。"""
    from app.storage.conversation.mysql_store import MySQLConversationStore
    store = MySQLConversationStore(db_session)
    await store.create(title="user_query")   # 包含字面 _
    await store.create(title="userXquery")   # _ 位置是 X
    results = await store.search("user_query")
    assert len(results) == 1, (
        f"搜索 'user_query' 应只返回包含字面 'user_query' 的记录，实际 {len(results)} 条"
    )
    assert results[0]["title"] == "user_query"


# ── 测试缺口补全 ──────────────────────────────────────────────────────────────

async def test_conv_store_count_escapes_percent_wildcard(db_session):
    """count(query) 的 % 转义与 search() 一致，不应把 % 当通配符计数。"""
    from app.storage.conversation.mysql_store import MySQLConversationStore
    store = MySQLConversationStore(db_session)
    await store.create(title="GMV增长50%")
    await store.create(title="GMV增长50元")
    count = await store.count("50%")
    assert count == 1, f"count('50%') 应为 1，实际为 {count}"


async def test_conv_store_search_escapes_backslash(db_session):
    """搜索字符串中的 \\ 不应破坏转义序列，只命中字面含 \\ 的标题。"""
    from app.storage.conversation.mysql_store import MySQLConversationStore
    store = MySQLConversationStore(db_session)
    await store.create(title=r"path\to\file")   # 包含字面反斜杠
    await store.create(title="path/to/file")    # 不含反斜杠
    results = await store.search("path\\to")
    assert len(results) == 1, (
        f"搜索 'path\\\\to' 应只返回含字面反斜杠的记录，实际 {len(results)} 条"
    )
    assert r"path\to\file" in results[0]["title"]


# ── N4: 空查询应返回空列表而非全表 ───────────────────────────────────────────

async def test_conv_store_search_empty_query_returns_empty(db_session):
    """search('') 不应返回所有记录（防止全表匹配）。"""
    from app.storage.conversation.mysql_store import MySQLConversationStore
    store = MySQLConversationStore(db_session)
    await store.create(title="会话A")
    await store.create(title="会话B")
    results = await store.search("")
    assert results == [], f"空查询应返回空列表，实际返回 {len(results)} 条"


async def test_conv_store_search_whitespace_query_returns_empty(db_session):
    """search('   ') 纯空白查询也应返回空列表。"""
    from app.storage.conversation.mysql_store import MySQLConversationStore
    store = MySQLConversationStore(db_session)
    await store.create(title="会话A")
    results = await store.search("   ")
    assert results == [], f"纯空白查询应返回空列表，实际返回 {len(results)} 条"


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

async def test_factory_returns_mysql_store(db_session):
    from app.storage.factory import get_conversation_store
    from app.storage.conversation.mysql_store import MySQLConversationStore
    store = get_conversation_store(session=db_session)
    assert isinstance(store, MySQLConversationStore)
    # 验证 store 可正常使用
    conv = await store.create(title="工厂测试")
    assert conv["title"] == "工厂测试"


def test_factory_returns_local_file_store():
    from app.storage.factory import get_file_store
    from app.storage.file.local_store import LocalFileStore
    store = get_file_store()
    assert isinstance(store, LocalFileStore)
