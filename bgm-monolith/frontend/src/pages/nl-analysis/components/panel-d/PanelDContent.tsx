import { useState } from 'react'

const DEMO_PROJECT = 'GMV分析项目'

const TREE = [
  {
    id: 'dir-reports', type: 'folder', name: '分析报告',
    children: [
      { id: 'f-monthly', type: 'file', name: '月报.md', icon: '📄', active: true },
      { id: 'f-weekly', type: 'file', name: '周报.md', icon: '📄', active: false },
    ]
  },
  {
    id: 'dir-sql', type: 'folder', name: 'SQL',
    children: [
      { id: 'f-sql1', type: 'file', name: 'gmv_query.sql', icon: '📄', active: false },
      { id: 'f-sql2', type: 'file', name: 'channel_roi.sql', icon: '📄', active: false },
    ]
  },
  {
    id: 'dir-chart', type: 'folder', name: '图表',
    children: [
      { id: 'f-chart1', type: 'file', name: '品类趋势.chart', icon: '📊', active: false },
    ]
  },
  { id: 'f-readme', type: 'file', name: 'README.md', icon: '📄', active: false, children: [] },
]

const TEMP_FILES = [
  { id: 't1', name: 'query_20260320_1.sql', icon: '📄' },
  { id: 't2', name: 'untitled.md', icon: '📄' },
  { id: 't3', name: 'chart_draft.chart', icon: '📊' },
]

interface TreeNodeProps {
  node: any
  depth?: number
}

function TreeNode({ node, depth = 0 }: TreeNodeProps) {
  const [open, setOpen] = useState(true)
  const [activeFile, setActiveFile] = useState<string | null>('f-monthly')

  if (node.type === 'folder') {
    return (
      <div>
        <div className="tree-item" style={{ paddingLeft: 8 + depth * 14 }} onClick={() => setOpen(v => !v)}>
          <span className={`tree-folder-arrow${open ? ' open' : ''}`}>▶</span>
          <span className="tree-icon">{open ? '📂' : '📁'}</span>
          {node.name}
        </div>
        {open && node.children?.map((child: any) => (
          <div key={child.id} className={`tree-item${child.active ? ' active' : ''}`} style={{ paddingLeft: 8 + (depth + 1) * 14 }}>
            <span className="tree-folder-arrow" style={{ visibility: 'hidden' }}>▶</span>
            <span className="tree-icon">{child.icon}</span>
            {child.name}
          </div>
        ))}
      </div>
    )
  }
  return (
    <div className={`tree-item${node.active ? ' active' : ''}`} style={{ paddingLeft: 8 + depth * 14 }}>
      <span className="tree-folder-arrow" style={{ visibility: 'hidden' }}>▶</span>
      <span className="tree-icon">{node.icon}</span>
      {node.name}
    </div>
  )
}

export default function PanelDContent() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div className="pd-project-select">
        <button data-testid="project-selector" className="pd-project-btn">
          <span className="pd-project-icon">📦</span>
          <span className="pd-project-name">{DEMO_PROJECT}</span>
          <span className="pd-project-arrow">▾</span>
        </button>
      </div>
      <div className="pd-actions">
        <button className="pd-act" title="新建文件">📄+</button>
        <button className="pd-act" title="新建文件夹">📁+</button>
        <button className="pd-act" title="刷新">🔄</button>
      </div>
      <div className="pd-tree" data-testid="file-tree">
        {TREE.map(node => <TreeNode key={node.id} node={node} />)}
      </div>
      <div className="pd-temp-sep" />
      <div className="pd-temp-label">
        📂 临时文件 <span className="temp-count">{TEMP_FILES.length}</span>
      </div>
      <div className="pd-tree" style={{ paddingTop: 0 }}>
        {TEMP_FILES.map(f => (
          <div key={f.id} className="tree-item">
            <span className="tree-folder-arrow" style={{ visibility: 'hidden' }}>▶</span>
            <span className="tree-icon">{f.icon}</span>
            {f.name}
          </div>
        ))}
      </div>
    </div>
  )
}
