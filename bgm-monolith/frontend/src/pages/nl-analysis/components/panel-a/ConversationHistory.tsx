import { useState } from 'react'
import { useChatStore } from '../../stores/chatStore'

const FOLDERS = [
  { id: 'f1', name: 'Q1季度分析', items: ['1月GMV复盘', '2月活动归因'] },
]

interface MergeMenuProps {
  onClose: () => void
  onMerge: (folder: string) => void
}

function MergeMenu({ onClose, onMerge }: MergeMenuProps) {
  return (
    <div className="merge-dropdown show" onClick={(e) => e.stopPropagation()}>
      <div className="merge-dropdown-title">移入文件夹</div>
      {FOLDERS.map(f => (
        <div key={f.id} className="merge-dropdown-item" onClick={() => { onMerge(f.name); onClose() }}>
          📁 {f.name}
        </div>
      ))}
      <div className="merge-dropdown-sep" />
      <div className="merge-dropdown-item merge-dropdown-new" onClick={() => { onMerge('新建文件夹'); onClose() }}>
        ＋ 新建文件夹
      </div>
    </div>
  )
}

export default function ConversationHistory() {
  const { conversations, currentConversationId, setCurrentConversation } = useChatStore()
  const [searchQuery, setSearchQuery] = useState('')
  const [openMergeId, setOpenMergeId] = useState<string | null>(null)
  const [folderOpen, setFolderOpen] = useState(true)

  const filtered = searchQuery
    ? conversations.filter(c => c.title.toLowerCase().includes(searchQuery.toLowerCase()))
    : conversations

  const pinned = filtered.filter(c => c.pinned)
  const unpinned = filtered.filter(c => !c.pinned)

  const handleMerge = (_id: string, _folderName: string) => {
    // handled by store in production
  }

  const renderItem = (conv: any) => (
    <div
      key={conv.id}
      data-testid={`agent-item-${conv.id}`}
      className={`pa-item${conv.id === currentConversationId ? ' active' : ''}`}
      onClick={() => setCurrentConversation(conv.id)}
    >
      <span className="pa-item-icon">💬</span>
      <div className="pa-item-info">
        <div className="pa-item-name">{conv.title}</div>
        <div className="pa-item-meta">
          {conv.model_name ?? conv.model ?? 'GPT-4o'}
          {conv.rounds != null ? ` · ${conv.rounds}轮对话` : ''}
        </div>
      </div>
      {conv.time && <span className="pa-item-time">{conv.time}</span>}
      <div
        className="pa-item-merge"
        onClick={(e) => { e.stopPropagation(); setOpenMergeId(openMergeId === conv.id ? null : conv.id) }}
      >
        📁
        {openMergeId === conv.id && (
          <MergeMenu onClose={() => setOpenMergeId(null)} onMerge={(folder) => handleMerge(conv.id, folder)} />
        )}
      </div>
    </div>
  )

  return (
    <div data-testid="conversation-history" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div className="pa-search">
        <input
          data-testid="search-input"
          type="text"
          placeholder="Search Agents..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
        />
      </div>
      <button
        data-testid="new-agent-btn"
        className="pa-new-btn"
      >
        ＋ New Agent
      </button>

      <div className="pa-title">Agents</div>

      <div className="pa-list">
        {filtered.length === 0 ? (
          <div data-testid="empty-state" style={{ color: 'var(--text-4)', fontSize: 12, textAlign: 'center', marginTop: 20 }}>
            No conversations yet
          </div>
        ) : (
          <>
            {pinned.length > 0 && (
              <>
                <div className="pa-group-label">📌 置顶</div>
                {pinned.map(renderItem)}
              </>
            )}

            {unpinned.length > 0 && unpinned.map(renderItem)}

            {/* Static folder for demo */}
            {conversations.length > 2 && (
              <div className="pa-folder">
                <div className="pa-folder-header" onClick={() => setFolderOpen(v => !v)}>
                  <span className={`pa-folder-arrow${folderOpen ? ' open' : ''}`}>▶</span>
                  <span className="pa-folder-name">📁 Q1季度分析</span>
                </div>
                {folderOpen && (
                  <div className="pa-folder-items">
                    {FOLDERS[0].items.map(name => (
                      <div key={name} className="pa-item">
                        <span className="pa-item-icon">💬</span>
                        <div className="pa-item-info"><div className="pa-item-name">{name}</div></div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </>
        )}

        {conversations.length > 0 && <div className="pa-more">Show more</div>}
      </div>
    </div>
  )
}
