import type { Message } from '../../../../../services/types'

export default function UserMessage({ message }: { message: Message }) {
  return (
    <div data-testid={`user-message-${message.id}`} style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 12 }}>
      <div style={{ background: '#2a2a5e', borderRadius: 12, padding: '8px 16px', maxWidth: '80%', color: '#e0e0e0', fontSize: 14 }}>
        {message.content}
      </div>
    </div>
  )
}
