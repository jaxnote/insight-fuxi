import { useState } from 'react'
import { useChatStore } from '../../stores/chatStore'
import AgentItem from './AgentItem'

export default function ConversationHistory() {
  const { conversations, currentConversationId, setCurrentConversation } = useChatStore()
  const [searchQuery, setSearchQuery] = useState('')

  const filtered = searchQuery
    ? conversations.filter((c) => c.title.toLowerCase().includes(searchQuery.toLowerCase()))
    : conversations

  return (
    <div data-testid="conversation-history" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ padding: '8px 8px 4px' }}>
        <input
          data-testid="search-input"
          type="text"
          placeholder="Search agents..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            width: '100%',
            background: '#1e1e3a',
            border: '1px solid #333',
            borderRadius: 4,
            color: '#ccc',
            padding: '4px 8px',
            fontSize: 12,
            boxSizing: 'border-box',
          }}
        />
      </div>

      <div style={{ padding: '4px 8px' }}>
        <button
          data-testid="new-agent-btn"
          style={{ width: '100%', background: '#3a3a6e', border: 'none', color: '#fff', borderRadius: 4, padding: '6px 0', cursor: 'pointer', fontSize: 12 }}
        >
          + New Agent
        </button>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '4px 8px' }}>
        {filtered.length === 0 ? (
          <div data-testid="empty-state" style={{ color: '#555', fontSize: 12, textAlign: 'center', marginTop: 20 }}>
            {searchQuery ? 'No matching conversations' : 'No conversations yet'}
          </div>
        ) : (
          filtered.map((conv) => (
            <AgentItem
              key={conv.id}
              id={conv.id}
              title={conv.title}
              isActive={conv.id === currentConversationId}
              onClick={() => setCurrentConversation(conv.id)}
            />
          ))
        )}
      </div>
    </div>
  )
}
