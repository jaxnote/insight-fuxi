import ChatArea from './ChatArea'
import InputArea from './InputArea'

export function ChatAreaWithInput() {
  return (
    <div data-testid="chat-area-with-input" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <ChatArea />
      <InputArea />
    </div>
  )
}
