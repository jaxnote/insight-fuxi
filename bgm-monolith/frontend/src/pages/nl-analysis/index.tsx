import { useEffect } from 'react'
import PanelContainer from './components/PanelContainer'
import { useChatStore } from './stores/chatStore'
import { useEditorStore } from './stores/editorStore'
import type { Conversation } from '../../services/types'

const DEMO_CONVERSATIONS: Conversation[] = [
  { id: 'pinned-1', title: 'GMV归因分析', folder: null as string | null, pinned: 1, model_name: 'GPT-4o', mode: 'agent', token_used: 0, token_limit: 128000, created_at: '2026-03-22T12:00:00' },
  { id: 'today-1', title: '渠道ROI对比', folder: null, pinned: 0, model_name: 'Claude 3.5', mode: 'agent', token_used: 0, token_limit: 128000, created_at: '2026-03-22T10:00:00' },
  { id: 'today-2', title: '新客转化漏斗', folder: null, pinned: 0, model_name: 'GPT-4o', mode: 'agent', token_used: 0, token_limit: 128000, created_at: '2026-03-22T08:00:00' },
  { id: 'week-1', title: '供应链分析', folder: null, pinned: 0, model_name: 'DeepSeek-V3', mode: 'agent', token_used: 0, token_limit: 128000, created_at: '2026-03-17T10:00:00' },
  { id: 'week-2', title: '退货率异常排查', folder: null, pinned: 0, model_name: 'GPT-4o', mode: 'agent', token_used: 0, token_limit: 128000, created_at: '2026-03-16T10:00:00' },
]

const DEMO_TABS = [
  { id: 'demo-tab-1', name: 'GMV分析结果.md', type: 'markdown' as const, content: '# GMV归因分析' },
  { id: 'demo-tab-2', name: 'gmv_category.sql', type: 'sql' as const, content: 'SELECT * FROM gmv_category' },
]

export default function NLAnalysisPage() {
  const { conversations, setConversations } = useChatStore()
  const { tabs, addTab } = useEditorStore()

  useEffect(() => {
    if (conversations.length === 0) {
      setConversations(DEMO_CONVERSATIONS)
    }
    if (tabs.length === 0) {
      DEMO_TABS.forEach(t => addTab(t))
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div data-testid="nl-analysis-page" style={{ flex: 1, display: 'flex', overflow: 'hidden', minHeight: 0 }}>
      <PanelContainer />
    </div>
  )
}
