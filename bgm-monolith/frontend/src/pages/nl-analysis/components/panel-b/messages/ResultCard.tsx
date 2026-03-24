import type { Message } from '../../../../../services/types'

export default function ResultCard({ message }: { message: Message }) {
  return (
    <div data-testid={`result-card-${message.id}`} style={{ marginBottom: 12, background: '#1a1a3e', borderRadius: 8, padding: 16, border: '1px solid #2a2a4e' }}>
      <div style={{ fontSize: 14, color: '#e0e0e0', whiteSpace: 'pre-wrap' }}>{message.content}</div>
    </div>
  )
}
