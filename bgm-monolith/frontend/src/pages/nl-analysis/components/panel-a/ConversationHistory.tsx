import React, { useState, useRef, useEffect, useCallback } from 'react'
import { MessageCircle, FolderInput, Pin, GripVertical } from 'lucide-react'
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

function formatRelativeTime(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  if (diff < 0) return '刚刚'
  const seconds = Math.floor(diff / 1000)
  if (seconds < 60) return '刚刚'
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}分钟前`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}小时前`
  const days = Math.floor(hours / 24)
  if (days < 30) return `${days}天前`
  const months = Math.floor(days / 30)
  if (months < 12) return `${months}个月前`
  return `${Math.floor(months / 12)}年前`
}

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

interface SortableItemProps {
  id: string
  children: (dragHandleProps: Record<string, unknown>) => React.ReactNode
}

function SortableItem({ id, children }: SortableItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id })
  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  }
  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      {children(listeners ?? {})}
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
    renameFolder,
    folders,
    reorderConversation,
    moveToFolder,
    createFolderFromMerge,
  } = useChatStore()

  const [searchQuery, setSearchQuery] = useState('')
  const [openMergeId, setOpenMergeId] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingType, setEditingType] = useState<'conversation' | 'folder'>('conversation')
  const [editValue, setEditValue] = useState('')
  const [activeId, setActiveId] = useState<string | null>(null)
  const [folderOpenMap, setFolderOpenMap] = useState<Record<string, boolean>>({})
  const editInputRef = useRef<HTMLInputElement>(null)
  const lastClickRef = useRef<{ id: string; time: number }>({ id: '', time: 0 })

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  )

  useEffect(() => {
    if (editingId && editInputRef.current) {
      editInputRef.current.focus()
      editInputRef.current.select()
    }
  }, [editingId])

  const startEditing = useCallback((id: string, title: string, type: 'conversation' | 'folder' = 'conversation') => {
    setEditingId(id)
    setEditingType(type)
    setEditValue(title)
  }, [])

  const commitRename = useCallback(() => {
    if (editingId && editValue.trim()) {
      if (editingType === 'folder') {
        renameFolder(editingId, editValue.trim())
      } else {
        renameConversation(editingId, editValue.trim())
      }
    }
    setEditingId(null)
  }, [editingId, editingType, editValue, renameConversation, renameFolder])

  const cancelEditing = useCallback(() => {
    setEditingId(null)
  }, [])

  const toggleFolder = useCallback((fId: string) => {
    setFolderOpenMap(prev => ({ ...prev, [fId]: !prev[fId] }))
  }, [])

  const [showAll, setShowAll] = useState(false)
  const MAX_VISIBLE = 5

  const filtered = searchQuery
    ? conversations.filter(c => c.title.toLowerCase().includes(searchQuery.toLowerCase()))
    : conversations

  const pinned = filtered.filter(c => c.pinned)
  const unpinned = filtered.filter(c => !c.pinned && !c.folderId)

  const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000
  const recentUnpinned = unpinned.filter(c => new Date(c.updated_at ?? c.created_at).getTime() >= sevenDaysAgo)
  const olderUnpinned = unpinned.filter(c => new Date(c.updated_at ?? c.created_at).getTime() < sevenDaysAgo)

  let visibleRecent = recentUnpinned
  let visibleOlder = olderUnpinned
  const totalCount = pinned.length + recentUnpinned.length + olderUnpinned.length

  if (!showAll && totalCount > MAX_VISIBLE) {
    let remaining = Math.max(0, MAX_VISIBLE - pinned.length)
    visibleRecent = recentUnpinned.slice(0, remaining)
    remaining = Math.max(0, remaining - visibleRecent.length)
    visibleOlder = olderUnpinned.slice(0, remaining)
  }

  const hiddenCount = totalCount - pinned.length - visibleRecent.length - visibleOlder.length
  const allVisibleUnpinned = [...visibleRecent, ...visibleOlder]
  const unpinnedIds = allVisibleUnpinned.map(c => c.id)

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

  const handleItemClick = useCallback((conv: Conversation) => {
    if (editingId) return
    const now = Date.now()
    const last = lastClickRef.current
    if (last.id === conv.id && now - last.time < 400) {
      lastClickRef.current = { id: '', time: 0 }
      startEditing(conv.id, conv.title)
    } else {
      lastClickRef.current = { id: conv.id, time: now }
      setCurrentConversation(conv.id)
    }
  }, [editingId, startEditing, setCurrentConversation])

  const renderItem = (conv: Conversation, dragHandleProps?: Record<string, unknown>) => {
    const isEditing = editingId === conv.id
    return (
      <div
        key={conv.id}
        data-testid={`agent-item-${conv.id}`}
        className={`pa-item${conv.id === currentConversationId ? ' active' : ''}`}
        onClick={() => handleItemClick(conv)}
      >
        <span className="pa-item-icon" {...(dragHandleProps ?? {})} style={{ cursor: 'grab' }}>
          {dragHandleProps ? <GripVertical size={14} /> : <MessageCircle size={14} />}
        </span>
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
            <div className="pa-item-name">
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
          <span className="pa-item-time">{formatRelativeTime(conv.updated_at ?? conv.created_at)}</span>
        )}
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

  const handleFolderClick = useCallback((folder: { id: string; name: string }) => {
    if (editingId) return
    const now = Date.now()
    const last = lastClickRef.current
    if (last.id === folder.id && now - last.time < 400) {
      lastClickRef.current = { id: '', time: 0 }
      startEditing(folder.id, folder.name, 'folder')
    } else {
      lastClickRef.current = { id: folder.id, time: now }
      toggleFolder(folder.id)
    }
  }, [editingId, startEditing, toggleFolder])

  const renderFolder = (folder: { id: string; name: string }) => {
    const isOpen = folderOpenMap[folder.id] !== false
    const isFolderEditing = editingId === folder.id && editingType === 'folder'
    const folderConvs = filtered.filter(c => c.folderId === folder.id)
    if (folderConvs.length === 0) return null
    return (
      <div key={folder.id} className="pa-folder">
        <div className="pa-folder-header" onClick={() => handleFolderClick(folder)}>
          <span className={`pa-folder-arrow${isOpen ? ' open' : ''}`}>▶</span>
          {isFolderEditing ? (
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
            <span className="pa-folder-name">📁 {folder.name}</span>
          )}
        </div>
        {isOpen && (
          <div className="pa-folder-items">
            {folderConvs.map(c => renderItem(c))}
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
            {pinned.map(c => renderItem(c))}
          </div>
        </div>
      )}

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
            {visibleRecent.length > 0 && (
              <>
                <div className="pa-group-title">Agents</div>
                <SortableContext items={unpinnedIds} strategy={verticalListSortingStrategy}>
                  {visibleRecent.map(conv => (
                    <SortableItem key={conv.id} id={conv.id}>
                      {(dragHandleProps) => renderItem(conv, dragHandleProps)}
                    </SortableItem>
                  ))}
                </SortableContext>
              </>
            )}

            {visibleOlder.length > 0 && (
              <>
                <div className="pa-group-title">7天前</div>
                <SortableContext items={visibleOlder.map(c => c.id)} strategy={verticalListSortingStrategy}>
                  {visibleOlder.map(conv => (
                    <SortableItem key={conv.id} id={conv.id}>
                      {(dragHandleProps) => renderItem(conv, dragHandleProps)}
                    </SortableItem>
                  ))}
                </SortableContext>
              </>
            )}

            {visibleRecent.length === 0 && visibleOlder.length === 0 && (
              <div className="pa-group-title">Agents</div>
            )}

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

        {!showAll && hiddenCount > 0 && (
          <div className="pa-more" onClick={() => setShowAll(true)}>
            展开更多（{hiddenCount}）
          </div>
        )}
        {showAll && totalCount > MAX_VISIBLE && (
          <div className="pa-more" onClick={() => setShowAll(false)}>
            收起
          </div>
        )}
      </div>
    </div>
  )
}
