import type { ReactNode } from 'react'

interface AgentFolderProps {
  name: string
  children?: ReactNode
}

export default function AgentFolder({ name, children }: AgentFolderProps) {
  return (
    <div data-testid={`agent-folder-${name.replace(/\s+/g, '-')}`}>
      <div style={{ padding: '4px 12px', color: '#888', fontSize: 12, fontWeight: 600 }}>
        📁 {name}
      </div>
      {children}
    </div>
  )
}
