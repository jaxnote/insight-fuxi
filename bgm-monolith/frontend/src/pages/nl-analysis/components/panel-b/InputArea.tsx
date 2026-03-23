import { useState } from 'react'
import { useChatStore } from '../../stores/chatStore'

export default function InputArea() {
  const [value, setValue] = useState('')
  const { addMessage } = useChatStore()

  const handleSend = () => {
    if (!value.trim()) return
    addMessage({
      id: crypto.randomUUID(),
      role: 'user',
      content_type: 'text',
      content: value.trim(),
      metadata: null,
      created_at: new Date().toISOString(),
    })
    setValue('')
  }

  return (
    <div data-testid="input-area" style={{ padding: 16, borderTop: '1px solid #2a2a3e' }}>
      <div style={{ display: 'flex', gap: 8 }}>
        <textarea
          data-testid="message-input"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() } }}
          placeholder="Ask anything... (Enter to send, Shift+Enter for newline)"
          rows={3}
          style={{ flex: 1, background: '#1e1e3a', border: '1px solid #333', borderRadius: 8, color: '#e0e0e0', padding: 12, fontSize: 14, resize: 'none', fontFamily: 'inherit' }}
        />
        <button
          data-testid="send-btn"
          onClick={handleSend}
          disabled={!value.trim()}
          style={{ background: '#4a4a8e', border: 'none', color: '#fff', borderRadius: 8, padding: '0 20px', cursor: 'pointer', fontSize: 14 }}
        >
          Send
        </button>
      </div>
    </div>
  )
}
