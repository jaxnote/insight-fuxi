import { useState } from 'react'
import { useEditorStore } from '../../stores/editorStore'

const DEMO_CONTENT = [
  { line: 1, tokens: [{ text: '# GMV 品类归因分析结果', color: '#c792ea' }] },
  { line: 2, tokens: [] },
  { line: 3, tokens: [{ text: '## 概要', color: '#82aaff' }] },
  { line: 4, tokens: [] },
  { line: 5, tokens: [{ text: '上月 GMV 整体下降 **-8.2%**，核心原因如下：', color: undefined }] },
  { line: 6, tokens: [] },
  { line: 7, tokens: [{ text: '## 品类明细', color: '#82aaff' }] },
  { line: 8, tokens: [] },
  { line: 9, tokens: [{ text: '| 品类 | 变化率 | 贡献度 |', color: undefined }] },
  { line: 10, tokens: [{ text: '|------|--------|--------|', color: undefined }] },
  { line: 11, tokens: [{ text: '| 3C数码 | ', color: undefined }, { text: '-12.3%', color: 'var(--red)' }, { text: ' | -5.1pp |', color: undefined }] },
  { line: 12, tokens: [{ text: '| 家电 | ', color: undefined }, { text: '-6.8%', color: 'var(--red)' }, { text: ' | -2.0pp |', color: undefined }] },
  { line: 13, tokens: [{ text: '| 美妆 | ', color: undefined }, { text: '+4.2%', color: 'var(--green)' }, { text: ' | +1.1pp |', color: undefined }] },
  { line: 14, tokens: [{ text: '| 食品 | ', color: undefined }, { text: '-2.1%', color: 'var(--red)' }, { text: ' | -0.8pp |', color: undefined }] },
  { line: 15, tokens: [{ text: '| 服饰 | ', color: undefined }, { text: '+1.5%', color: 'var(--green)' }, { text: ' | +0.4pp |', color: undefined }] },
  { line: 16, tokens: [] },
  { line: 17, tokens: [{ text: '## 关键洞察', color: '#82aaff' }] },
  { line: 18, tokens: [] },
  { line: 19, tokens: [{ text: '1. **3C 数码**为最大拖累项', color: undefined }] },
  { line: 20, tokens: [{ text: '   - 手机品类促销力度弱于上月', color: undefined }] },
  { line: 21, tokens: [{ text: '   - 建议: 针对性加强 3C 促销', color: undefined }] },
  { line: 22, tokens: [] },
  { line: 23, tokens: [{ text: '2. **美妆**逆势增长', color: undefined }] },
  { line: 24, tokens: [{ text: '   - 新品上市带动客单价提升', color: undefined }] },
  { line: 25, tokens: [] },
  { line: 26, tokens: [{ text: '<!-- 可在此处手动补充更多分析 -->', color: '#546e7a' }] },
]

const TABS = [
  { id: 'demo-1', name: 'GMV分析结果.md', type: 'markdown' as const, content: '# GMV归因分析', icon: '📊' },
  { id: 'demo-2', name: 'gmv_category.sql', type: 'sql' as const, content: 'SELECT * FROM gmv_category', icon: '📄' },
]

export default function EditorPreview() {
  const { tabs, activeTabId, setActiveTab: setStoreActiveTab } = useEditorStore()
  const [localActiveTab, setLocalActiveTab] = useState<string | null>(null)
  const [toolMode, setToolMode] = useState<'edit' | 'preview'>('edit')

  const activeTab = activeTabId ?? localActiveTab ?? tabs[0]?.id

  const closeTab = (id: string) => {
    const next = tabs.filter(t => t.id !== id)
    if (activeTab === id && next.length > 0) setStoreActiveTab(next[0].id)
  }

  if (tabs.length === 0) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }} data-testid="editor-preview">
        <div className="pc-empty" data-testid="editor-empty-state">未打开任何文件</div>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }} data-testid="editor-preview">
      <div className="pc-tabs" data-testid="tab-bar">
        {tabs.map(tab => (
          <div
            key={tab.id}
            data-testid={`tab-${tab.id}`}
            className={`pc-tab${tab.id === activeTab ? ' active' : ''}`}
            onClick={() => { setStoreActiveTab(tab.id); setLocalActiveTab(tab.id) }}
          >
            <span>{(tab as any).icon ?? '📄'}</span>
            {tab.name}
            <span className="pc-tab-close" onClick={(e) => { e.stopPropagation(); closeTab(tab.id) }}>✕</span>
          </div>
        ))}
      </div>
      <div className="pc-toolbar">
        <button className={`pc-tool-btn${toolMode === 'edit' ? ' active' : ''}`} onClick={() => setToolMode('edit')}>📝 编辑</button>
        <button className={`pc-tool-btn${toolMode === 'preview' ? ' active' : ''}`} onClick={() => setToolMode('preview')}>👁️ 预览</button>
        <div className="pc-tool-sep" />
        <button className="pc-tool-btn">💾 保存</button>
        <button className="pc-tool-btn">📥 导出</button>
        <div style={{ flex: 1 }} />
        <button className="pc-tool-btn">···</button>
      </div>
      <div className="pc-content">
        {DEMO_CONTENT.map(row => (
          <div key={row.line}>
            <span className="pc-line-num">{String(row.line).padStart(2, ' ')}</span>
            {row.tokens.map((tok, i) => (
              <span key={i} style={tok.color ? { color: tok.color } : undefined}>{tok.text}</span>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
