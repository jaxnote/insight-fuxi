export interface Conversation {
  id: string
  title: string
  folder: string | null
  pinned: number
  model_name: string
  mode: 'agent' | 'plan'
  token_used: number
  token_limit: number
  created_at: string
  updated_at: string
  order: number
  folderId: string | null
}

export interface Folder {
  id: string
  name: string
  order: number
}

export interface Message {
  id: string
  role: 'user' | 'assistant'
  content_type: 'text' | 'sql' | 'chart' | 'table'
  content: string
  metadata: Record<string, unknown> | null
  created_at: string
}

export interface Project {
  id: string
  name: string
  description: string | null
  created_at: string
}
