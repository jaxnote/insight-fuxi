interface AgentItemProps {
  id: string
  title: string
  isActive?: boolean
  onClick: () => void
}

export default function AgentItem({ id, title, isActive, onClick }: AgentItemProps) {
  return (
    <div
      data-testid={`agent-item-${id}`}
      onClick={onClick}
      style={{
        padding: '8px 12px',
        borderRadius: 6,
        cursor: 'pointer',
        background: isActive ? '#2a2a4e' : 'transparent',
        color: '#e0e0e0',
        fontSize: 13,
        marginBottom: 2,
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        border: isActive ? '1px solid #4a4a7e' : '1px solid transparent',
      }}
    >
      {title}
    </div>
  )
}
