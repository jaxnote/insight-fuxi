import { useState, useRef, useEffect, useCallback } from 'react'
import { MessageCircle, FolderInput, Pin } from 'lucide-react'
import {
  DndContext,
  closestCenter,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  type DragStartEvent,
  type DragEndEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useChatStore } from '../../stores/chatStore'
import type { Conversation } from '../../../../services/types'

interface MergeMenuProps {
  folders: { id: string; name: string }[]
  onClose: () => void
  onMerge: (folderId: string) => void
  onNewFolder: () => void
}

function MergeMenu({ folders, onClose, onMerge, onNewFolder }: MergeMenuProps) {
  return (
    <div className="merge-dropdown show" onClick={(e) => e.stopPropagation()}>
      <div className="merge-dropdown-title">移入文件夹</div>
      {folders.map(f => (
        <div key={f.id} className="merge-dropdown-item" onClick={() => { onMerge(f.id); onClose() }}>
          📁 {f.name}
        </div>
      ))}
      <div className="merge-dropdown-sep" />
      <div className="merge-dropdown-item merge-dropdown-new" onClick={() => { onNewFolder(); onClose() }}>
        ＋ 新建文件夹
      </div>
    </div>
  )
}

function SortableItem({ id, children }: { id: string; children: React.ReactNode }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id })
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  }
  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {children}
    </div>
  )
}

export default function ConversationHistory() {
  const {
    conversations,
    currentConversationId,
    setCurrentConversation,
    togglePin,
    renameConversation,
    folders,
    reorderConversation,
    moveToFolder,
    createFolderFromMerge,
  } = useChatStore()

  const [searchQuery, setSearchQuery] = useState('')
  const [openMergeId, setOpenMergeId] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editValue, setEditValue] = useState('')
  const [activeId, setActiveId] = useState<string | null>(null)
  const [folderOpenMap, setFolderOpenMap] = useState<Record<string, boolean>>({})
  const editInputRef = useRef<HTMLInputElement>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  )

  useEffect(() => {
    if (editingId && editInputRef.current) {
      editInputRef.current.focus()
      editInputRef.current.select()
    }
  }, [editingId])

  const startEditing = useCallback((id: string, title: string) => {
    setEditingId(id)
    setEditValue(title)
  }, [])

  const commitRename = useCallback(() => {
    if (editingId && editValue.trim()) {
      renameConversation(editingId, editValue.trim())
    }
    setEditingId(null)
  }, [editingId, editValue, renameConversation])

  const cancelEditing = useCallback(() => {
    setEditingId(null)
  }, [])

  const toggleFolder = useCallback((fId: string) => {
    setFolderOpenMap(prev => ({ ...prev, [fId]: !prev[fId] }))
  }, [])

  const filtered = searchQuery
    ? conversations.filter(c => c.title.toLowerCase().includes(searchQuery.toLowerCase()))
    : conversations

  const pinned = filtered.filter(c => c.pinned)
  const unpinned = filtered.filter(c => !c.pinned && !c.folderId)
  const unpinnedIds = unpinned.map(c => c.id)

  const handleDragStart = (event: DragStartEvent) => {
    if (editingId) return
    setActiveId(event.active.id as string)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    setActiveId(null)
    if (!over || active.id === over.id) return

    const activeConv = conversations.find(c => c.id === active.id)
    const overConv = conversations.find(c => c.id === over.id)
    if (!activeConv || !overConv) return

    if (!overConv.folderId && !activeConv.folderId) {
      reorderConversation(active.id as string, over.id as string)
    }
  }

  const handleMerge = (convId: string, folderId: string) => {
    moveToFolder(convId, folderId)
  }

  const activeConv = activeId ? conversations.find(c => c.id === activeId) : null

  const renderItem = (conv: Conversation) => {
    const isEditing = editingId === conv.id
    return (
      <div
        key={conv.id}
        data-testid={`agent-item-${conv.id}`}
        className={`pa-item${conv.id === currentConversationId ? ' active' : ''}`}
        onClick={() => !isEditing && setCurrentConversation(conv.id)}
      >
        <span className="pa-item-icon"><MessageCircle size={14} /></span>
        <div className="pa-item-info">
          {isEditing ? (
            <input
              ref={editInputRef}
              className="pa-item-rename-input"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') commitRename()
                if (e.key === 'Escape') cancelEditing()
              }}
              onBlur={commitRename}
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            <div
              className="pa-item-name"
              onDoubleClick={(e) => { e.stopPropagation(); startEditing(conv.id, conv.title) }}
            >
              {conv.title}
            </div>
          )}
          {!isEditing && (
            <div className="pa-item-meta">
              {conv.model_name ?? 'GPT-4o'}
            </div>
          )}
        </div>
        {!isEditing && (
          <div className="pa-item-actions">
            <button
              className={`pa-item-pin${conv.pinned ? ' pinned' : ''}`}
              onClick={(e) => { e.stopPropagation(); togglePin(conv.id) }}
              aria-label={conv.pinned ? '取消置顶' : '置顶'}
              title={conv.pinned ? '取消置顶' : '置顶'}
            >
              <Pin size={12} />
            </button>
            <div
              className="pa-item-merge"
              onClick={(e) => { e.stopPropagation(); setOpenMergeId(openMergeId === conv.id ? null : conv.id) }}
            >
              <FolderInput size={12} />
              {openMergeId === conv.id && (
                <MergeMenu
                  folders={folders}
                  onClose={() => setOpenMergeId(null)}
                  onMerge={(fId) => handleMerge(conv.id, fId)}
                  onNewFolder={() => {
                    const other = unpinned.find(c => c.id !== conv.id)
                    if (other) createFolderFromMerge(conv.id, other.id)
                  }}
                />
              )}
            </div>
          </div>
        )}
      </div>
    )
  }

  const renderFolder = (folder: { id: string; name: string }) => {
    const isOpen = folderOpenMap[folder.id] !== false
    const folderConvs = filtered.filter(c => c.folderId === folder.id)
    if (folderConvs.length === 0) return null
    return (
      <div key={folder.id} className="pa-folder">
        <div className="pa-folder-header" onClick={() => toggleFolder(folder.id)}>
          <span className={`pa-folder-arrow${isOpen ? ' open' : ''}`}>▶</span>
          <span className="pa-folder-name">📁 {folder.name}</span>
        </div>
        {isOpen && (
          <div className="pa-folder-items">
            {folderConvs.map(renderItem)}
          </div>
        )}
      </div>
    )
  }

  return (
    <div data-testid="conversation-history" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div className="pa-search">
        <input
          data-testid="search-input"
          type="text"
          placeholder="Search Agents..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
        />
      </div>
      <button
        data-testid="new-agent-btn"
        className="pa-new-btn"
      >
        ＋ New Agent
      </button>

      {pinned.length > 0 && (
        <div className="pa-pinned-section">
          <div className="pa-group-label pa-pin-label">
            <Pin size={12} /> 置顶
          </div>
          <div className="pa-pinned-list">
            {pinned.map(renderItem)}
          </div>
        </div>
      )}

      <div className="pa-title">Agents</div>

      <div className="pa-list">
        {filtered.length === 0 ? (
          <div data-testid="empty-state" style={{ color: 'var(--text-4)', fontSize: 12, textAlign: 'center', marginTop: 20 }}>
            No conversations yet
          </div>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            <SortableContext items={unpinnedIds} strategy={verticalListSortingStrategy}>
              {unpinned.map(conv => (
                <SortableItem key={conv.id} id={conv.id}>
                  {renderItem(conv)}
                </SortableItem>
              ))}
            </SortableContext>

            <DragOverlay>
              {activeConv ? (
                <div className="pa-drag-overlay">
                  <div className="pa-item">
                    <span className="pa-item-icon"><MessageCircle size={14} /></span>
                    <div className="pa-item-info">
                      <div className="pa-item-name">{activeConv.title}</div>
                    </div>
                  </div>
                </div>
              ) : null}
            </DragOverlay>

            {folders.map(renderFolder)}
          </DndContext>
        )}

        {conversations.length > 0 && <div className="pa-more">Show more</div>}
      </div>
    </div>
  )
}
