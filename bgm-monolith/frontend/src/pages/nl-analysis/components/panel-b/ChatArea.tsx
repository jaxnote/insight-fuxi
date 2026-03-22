import { useChatStore } from '../../stores/chatStore'
import UserMessage from './messages/UserMessage'
import ResultCard from './messages/ResultCard'

export default function ChatArea() {
  const { messages } = useChatStore()

  return (
    <div data-testid="chat-area" style={{ flex: 1, overflowY: 'auto', padding: '0 16px' }}>
      {messages.length === 0 ? (
        <div data-testid="welcome-message" style={{ textAlign: 'center', color: '#555', padding: 40 }}>
          <h2 style={{ color: '#888' }}>Data Coding Workspace</h2>
          <p>发送消息开始分析...</p>
        </div>
      ) : (
        messages.map((msg) =>
          msg.role === 'user'
            ? <UserMessage key={msg.id} message={msg} />
            : <ResultCard key={msg.id} message={msg} />
        )
      )}
    </div>
  )
}
