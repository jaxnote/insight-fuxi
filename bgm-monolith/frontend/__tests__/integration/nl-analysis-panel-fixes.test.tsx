import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '../../src/test-utils/render'
import userEvent from '@testing-library/user-event'
import { useChatStore } from '../../src/pages/nl-analysis/stores/chatStore'
import { usePanelStore } from '../../src/pages/nl-analysis/stores/panelStore'
import PanelContainer from '../../src/pages/nl-analysis/components/PanelContainer'
import ConversationHistory from '../../src/pages/nl-analysis/components/panel-a/ConversationHistory'

const mkConv = (overrides: Partial<import('../../src/services/types').Conversation> & { id: string; title: string }) => ({
  folder: null,
  pinned: 0,
  model_name: 'gpt-4o',
  mode: 'agent' as const,
  token_used: 0,
  token_limit: 128000,
  created_at: '2026-01-01',
  updated_at: '2026-01-01',
  order: 0,
  folderId: null,
  ...overrides,
})

describe('chatStore.togglePin', () => {
  beforeEach(() => {
    useChatStore.setState({
      conversations: [
        mkConv({ id: 'c1', title: 'Test', order: 0 }),
        mkConv({ id: 'c2', title: 'Test2', pinned: 1, order: 1 }),
      ],
      currentConversationId: null,
      messages: [],
      isLoading: false,
      folders: [],
    })
  })

  it('should pin an unpinned conversation', () => {
    useChatStore.getState().togglePin('c1')
    const conv = useChatStore.getState().conversations.find(c => c.id === 'c1')
    expect(conv?.pinned).toBe(1)
  })

  it('should unpin a pinned conversation', () => {
    useChatStore.getState().togglePin('c2')
    const conv = useChatStore.getState().conversations.find(c => c.id === 'c2')
    expect(conv?.pinned).toBe(0)
  })
})

describe('Phase 1 UI 集成 - resize handles', () => {
  beforeEach(() => {
    useChatStore.setState({
      conversations: [
        mkConv({ id: 'c1', title: 'GMV分析', pinned: 1, order: 0 }),
        mkConv({ id: 'c2', title: '渠道ROI', model_name: 'claude-3.5', order: 1 }),
      ],
      currentConversationId: null,
      messages: [],
      isLoading: false,
      folders: [],
    })
  })

  it('Panel A 可见时应显示 1 条 resize handle', () => {
    usePanelStore.setState({
      panelA: { visible: true, width: 240 },
      panelB: { visible: true, width: 600 },
      panelC: { visible: false, width: 400 },
      panelD: { visible: false, width: 240 },
    })
    render(<PanelContainer />)
    const handles = document.querySelectorAll('.resize-handle')
    expect(handles.length).toBe(1)
  })

  it('A+C+D 全可见时应显示 3 条 resize handle', () => {
    usePanelStore.setState({
      panelA: { visible: true, width: 240 },
      panelB: { visible: true, width: 600 },
      panelC: { visible: true, width: 400 },
      panelD: { visible: true, width: 240 },
    })
    render(<PanelContainer />)
    const handles = document.querySelectorAll('.resize-handle')
    expect(handles.length).toBe(3)
  })
})

describe('chatStore.renameConversation', () => {
  beforeEach(() => {
    useChatStore.setState({
      conversations: [
        mkConv({ id: 'c1', title: 'Original', order: 0 }),
      ],
      currentConversationId: null,
      messages: [],
      isLoading: false,
      folders: [],
    })
  })

  it('should rename a conversation', () => {
    useChatStore.getState().renameConversation('c1', 'Renamed')
    const conv = useChatStore.getState().conversations.find(c => c.id === 'c1')
    expect(conv?.title).toBe('Renamed')
  })
})

describe('Phase 2 - 双击重命名', () => {
  const user = userEvent.setup()

  beforeEach(() => {
    useChatStore.setState({
      conversations: [
        mkConv({ id: 'c1', title: 'GMV分析', order: 0 }),
      ],
      currentConversationId: null,
      messages: [],
      isLoading: false,
      folders: [],
    })
  })

  it('双击会话名称进入编辑态', async () => {
    render(<ConversationHistory />)
    const name = screen.getByText('GMV分析')
    await user.dblClick(name)
    const input = document.querySelector('.pa-item-rename-input') as HTMLInputElement
    expect(input).toBeTruthy()
    expect(input.value).toBe('GMV分析')
  })

  it('Enter 确认重命名', async () => {
    render(<ConversationHistory />)
    const name = screen.getByText('GMV分析')
    await user.dblClick(name)
    const input = document.querySelector('.pa-item-rename-input') as HTMLInputElement
    await user.clear(input)
    await user.type(input, '新名称{Enter}')
    expect(useChatStore.getState().conversations[0].title).toBe('新名称')
    expect(document.querySelector('.pa-item-rename-input')).toBeNull()
  })

  it('Escape 取消编辑', async () => {
    render(<ConversationHistory />)
    const name = screen.getByText('GMV分析')
    await user.dblClick(name)
    const input = document.querySelector('.pa-item-rename-input') as HTMLInputElement
    await user.clear(input)
    await user.type(input, '别的名字{Escape}')
    expect(useChatStore.getState().conversations[0].title).toBe('GMV分析')
    expect(document.querySelector('.pa-item-rename-input')).toBeNull()
  })
})

describe('reorderConversation', () => {
  beforeEach(() => {
    useChatStore.setState({
      conversations: [
        mkConv({ id: 'c1', title: 'First', order: 0 }),
        mkConv({ id: 'c2', title: 'Second', order: 1 }),
        mkConv({ id: 'c3', title: 'Third', order: 2 }),
      ],
      currentConversationId: null,
      messages: [],
      isLoading: false,
      folders: [],
    })
  })

  it('should move c3 before c1', () => {
    useChatStore.getState().reorderConversation('c3', 'c1')
    const ids = useChatStore.getState().conversations.map(c => c.id)
    expect(ids).toEqual(['c3', 'c1', 'c2'])
  })

  it('should reassign order numbers after reorder', () => {
    useChatStore.getState().reorderConversation('c3', 'c1')
    const orders = useChatStore.getState().conversations.map(c => c.order)
    expect(orders).toEqual([0, 1, 2])
  })

  it('should be no-op when activeId equals overId', () => {
    useChatStore.getState().reorderConversation('c1', 'c1')
    const ids = useChatStore.getState().conversations.map(c => c.id)
    expect(ids).toEqual(['c1', 'c2', 'c3'])
  })
})

describe('createFolderFromMerge', () => {
  beforeEach(() => {
    useChatStore.setState({
      conversations: [
        mkConv({ id: 'c1', title: 'Alpha', order: 0 }),
        mkConv({ id: 'c2', title: 'Beta', order: 1 }),
      ],
      currentConversationId: null,
      messages: [],
      isLoading: false,
      folders: [],
    })
  })

  it('should create a new folder and assign both conversations', () => {
    useChatStore.getState().createFolderFromMerge('c1', 'c2')
    const state = useChatStore.getState()
    expect(state.folders).toHaveLength(1)
    const folder = state.folders[0]
    expect(folder.name).toBe('Beta +1')
    const c1 = state.conversations.find(c => c.id === 'c1')
    const c2 = state.conversations.find(c => c.id === 'c2')
    expect(c1?.folderId).toBe(folder.id)
    expect(c2?.folderId).toBe(folder.id)
  })

  it('should not create folder for non-existent conversation', () => {
    useChatStore.getState().createFolderFromMerge('c1', 'non-existent')
    expect(useChatStore.getState().folders).toHaveLength(0)
  })
})

describe('moveToFolder / removeFromFolder', () => {
  beforeEach(() => {
    useChatStore.setState({
      conversations: [
        mkConv({ id: 'c1', title: 'Alpha', order: 0 }),
        mkConv({ id: 'c2', title: 'Beta', order: 1 }),
      ],
      currentConversationId: null,
      messages: [],
      isLoading: false,
      folders: [{ id: 'f1', name: 'TestFolder', order: 0 }],
    })
  })

  it('moveToFolder should set folderId', () => {
    useChatStore.getState().moveToFolder('c1', 'f1')
    const c1 = useChatStore.getState().conversations.find(c => c.id === 'c1')
    expect(c1?.folderId).toBe('f1')
  })

  it('removeFromFolder should clear folderId', () => {
    useChatStore.getState().moveToFolder('c1', 'f1')
    useChatStore.getState().removeFromFolder('c1')
    const c1 = useChatStore.getState().conversations.find(c => c.id === 'c1')
    expect(c1?.folderId).toBeNull()
  })

  it('moveToFolder should not affect other conversations', () => {
    useChatStore.getState().moveToFolder('c1', 'f1')
    const c2 = useChatStore.getState().conversations.find(c => c.id === 'c2')
    expect(c2?.folderId).toBeNull()
  })
})
