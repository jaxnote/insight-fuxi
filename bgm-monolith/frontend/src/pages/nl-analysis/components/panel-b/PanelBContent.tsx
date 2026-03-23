import { useState, useEffect, useRef } from 'react'
import { useChatStore } from '../../stores/chatStore'

// ─── Mock demo messages ────────────────────────────────────────────────────

const DEMO_STEPS = [
  { name: '意图识别', badge: 'Agent', badgeClass: 'badge-agent-tag', agent: '归因分析 Agent', time: '1.2s' },
  { name: '指标定位', badge: 'MCP', badgeClass: 'badge-mcp-tag', agent: '指标库', time: '0.8s' },
  { name: '数据拉取', badge: 'MCP', badgeClass: 'badge-mcp-tag', agent: '元数据服务', time: '3.4s' },
  { name: '归因拆解', badge: 'Skill', badgeClass: 'badge-skill-tag', agent: '品类归因拆解', time: '2.1s' },
  { name: '洞察生成', badge: 'Agent', badgeClass: 'badge-agent-tag', agent: '归因分析 Agent', time: '1.8s' },
]

// ─── Sub-components ────────────────────────────────────────────────────────

function TokenWarning({ onDismiss }: { onDismiss: () => void }) {
  return (
    <div className="token-warning animate-fade">
      <div className="token-warning-text">⚠️ 上下文即将用满，建议压缩历史记录以继续对话</div>
      <div className="token-warning-actions">
        <button className="tw-btn">🤖 自动压缩</button>
        <button className="tw-btn">/compress 手动处理</button>
        <button className="tw-btn dismiss" onClick={onDismiss}>暂不处理</button>
      </div>
    </div>
  )
}

function ProgressSteps({ open: defaultOpen = true }: { open?: boolean }) {
  const [open, setOpen] = useState(defaultOpen)
  const [openStep, setOpenStep] = useState<number | null>(null)

  return (
    <div className="progress-steps">
      <div className="progress-header" onClick={() => setOpen(v => !v)}>
        <span className={`progress-chevron${open ? ' open' : ''}`}>▶</span>
        <span style={{ fontSize: 13 }}>🤖</span>
        <span className="progress-summary">分析完成 · 5 个步骤</span>
        <span className="progress-count">5/5 ✅</span>
      </div>
      <div className={`progress-body${open ? '' : ' hidden'}`}>
        {DEMO_STEPS.map((step, i) => (
          <div key={i}>
            <div className="p-step" onClick={() => setOpenStep(openStep === i ? null : i)}>
              <div className="p-step-icon done">✓</div>
              <div className="p-step-info">
                <div className="p-step-name">{step.name}</div>
                <div className="p-step-agent">
                  <span className={`p-step-agent-badge ${step.badgeClass}`}>{step.badge}</span>
                  {step.agent}
                </div>
              </div>
              <div className="p-step-time">{step.time}</div>
            </div>
            {openStep === i && (
              <div className="p-step-detail show">
                <div className="p-step-detail-row">
                  <span className="p-step-detail-label">状态</span>
                  <span className="p-step-detail-val">已完成 · {step.time}</span>
                </div>
                <div className="p-step-detail-row">
                  <span className="p-step-detail-label">执行者</span>
                  <span className="p-step-detail-val">{step.agent}</span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

function InsertDropdown({ onClose }: { onClose: () => void }) {
  return (
    <div className="insert-dropdown show">
      <div className="insert-dd-title">选择目标文件</div>
      {['月报.md', '周报.md', 'README.md'].map(f => (
        <div key={f} className="insert-dd-item" onClick={() => onClose()}>
          📄 {f} <span className="insert-dd-path">分析报告/</span>
        </div>
      ))}
      <div className="insert-dd-sep" />
      <div className="insert-dd-item" style={{ color: 'var(--accent)' }} onClick={() => onClose()}>
        ＋ 新建文件并插入
      </div>
    </div>
  )
}

function ResultCardText() {
  const [showInsert, setShowInsert] = useState(false)
  return (
    <div className="result-card animate-slide">
      <div className="rc-header">📝 文字洞察</div>
      <div className="rc-body">
        上月 GMV 整体下降 <span className="val-down">-8.2%</span>，核心原因：<br /><br />
        <strong style={{ color: 'var(--text-1)' }}>1. 3C 数码</strong> — 下降 <span className="val-down">-12.3%</span>（贡献 -5.1pp）<br />
        &nbsp;&nbsp;• 手机品类促销力度弱于上月，竞品大促分流严重<br /><br />
        <strong style={{ color: 'var(--text-1)' }}>2. 家电</strong> — 下降 <span className="val-down">-6.8%</span>（贡献 -2.0pp）<br />
        &nbsp;&nbsp;• 大家电订单量下降 8.2%，季节性因素影响<br /><br />
        <strong style={{ color: 'var(--text-1)' }}>3. 美妆</strong> — 增长 <span className="val-up">+4.2%</span>（贡献 +1.1pp）<br />
        &nbsp;&nbsp;• 新品上市 + 直播带货拉动客单价提升
      </div>
      <div className="rc-actions">
        <button className="rc-act">💾 保存到项目</button>
        <button className="rc-act">📁 保存到临时</button>
        <div className="insert-dropdown-wrap">
          <button className="rc-act" onClick={() => setShowInsert(v => !v)}>📌 插入到文件</button>
          {showInsert && <InsertDropdown onClose={() => setShowInsert(false)} />}
        </div>
        <button className="rc-act primary">📝 编辑器打开</button>
        <button className="rc-act">📋 复制</button>
      </div>
    </div>
  )
}

function ResultCardChart() {
  const [showInsert, setShowInsert] = useState(false)
  const bars = [
    { label: '3C', pct: 85, color: '#f87171', change: '-12.3%', up: false },
    { label: '家电', pct: 60, color: '#fb923c', change: '-6.8%', up: false },
    { label: '美妆', pct: 45, color: '#4ade80', change: '+4.2%', up: true },
    { label: '食品', pct: 35, color: '#fb923c', change: '-2.1%', up: false },
    { label: '服饰', pct: 25, color: '#4ade80', change: '+1.5%', up: true },
  ]
  return (
    <div className="result-card animate-slide">
      <div className="rc-header">📊 品类 GMV 对比图表</div>
      <div className="rc-chart" style={{ height: 160 }}>
        {bars.map(b => (
          <div key={b.label} className="chart-bar-group">
            <div className="chart-bar" style={{ height: `${b.pct}%`, background: `linear-gradient(to top, #2a2040, ${b.color})` }} />
            <div className="chart-label">
              {b.label}<br />
              <span style={{ color: b.up ? 'var(--green)' : 'var(--red)', fontSize: 9 }}>{b.change}</span>
            </div>
          </div>
        ))}
      </div>
      <div className="rc-actions">
        <button className="rc-act">💾 保存到项目</button>
        <div className="insert-dropdown-wrap">
          <button className="rc-act" onClick={() => setShowInsert(v => !v)}>📌 插入到文件</button>
          {showInsert && <InsertDropdown onClose={() => setShowInsert(false)} />}
        </div>
        <button className="rc-act primary">📝 编辑器打开</button>
        <button className="rc-act">📐 调整参数</button>
      </div>
    </div>
  )
}

function ResultCardTable() {
  const [showInsert, setShowInsert] = useState(false)
  const rows = [
    { cat: '3C数码', gmv: '8,234', pct: '38.2%', mom: '-12.3%', contrib: '-5.1pp', down: true },
    { cat: '家电', gmv: '5,621', pct: '26.1%', mom: '-6.8%', contrib: '-2.0pp', down: true },
    { cat: '美妆', gmv: '3,156', pct: '14.6%', mom: '+4.2%', contrib: '+1.1pp', down: false },
    { cat: '食品', gmv: '2,845', pct: '13.2%', mom: '-2.1%', contrib: '-0.8pp', down: true },
    { cat: '服饰', gmv: '1,698', pct: '7.9%', mom: '+1.5%', contrib: '+0.4pp', down: false },
  ]
  return (
    <div className="result-card animate-slide">
      <div className="rc-header">📋 品类明细数据表</div>
      <div style={{ padding: '10px 16px', overflowX: 'auto' }}>
        <table className="data-table">
          <thead>
            <tr>
              <th>品类</th>
              <th className="right">GMV（万）</th>
              <th className="right">占比</th>
              <th className="right">环比</th>
              <th className="right">贡献度</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(r => (
              <tr key={r.cat}>
                <td style={{ color: 'var(--text-1)' }}>{r.cat}</td>
                <td className="right">{r.gmv}</td>
                <td className="right">{r.pct}</td>
                <td className="right" style={{ color: r.down ? 'var(--red)' : 'var(--green)' }}>{r.mom}</td>
                <td className="right" style={{ color: r.down ? 'var(--red)' : 'var(--green)' }}>{r.contrib}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="rc-actions">
        <button className="rc-act">💾 保存到项目</button>
        <div className="insert-dropdown-wrap">
          <button className="rc-act" onClick={() => setShowInsert(v => !v)}>📌 插入到文件</button>
          {showInsert && <InsertDropdown onClose={() => setShowInsert(false)} />}
        </div>
        <button className="rc-act primary">📝 编辑器打开</button>
        <button className="rc-act">📥 导出CSV</button>
      </div>
    </div>
  )
}

function SqlOutputPending() {
  const [showInsert, setShowInsert] = useState(false)
  return (
    <div className="sql-output animate-slide">
      <div className="sql-output-header">
        <span>📄 SQL · 按渠道拆分 DAU</span>
        <span className="sql-output-status pending">待执行</span>
      </div>
      <div className="sql-output-code">
        <span className="sql-kw">SELECT</span>{'\n'}
        {'  '}channel,{'\n'}
        {'  '}dt,{'\n'}
        {'  '}<span className="sql-fn">COUNT</span>(<span className="sql-kw">DISTINCT</span> user_id) <span className="sql-kw">AS</span> dau{'\n'}
        <span className="sql-kw">FROM</span> dw.fact_active_user{'\n'}
        <span className="sql-kw">WHERE</span> dt <span className="sql-kw">BETWEEN</span> <span className="sql-str">'2026-03-01'</span> <span className="sql-kw">AND</span> <span className="sql-str">'2026-03-19'</span>{'\n'}
        <span className="sql-kw">GROUP BY</span> channel, dt{'\n'}
        <span className="sql-kw">ORDER BY</span> dt <span className="sql-kw">DESC</span>, dau <span className="sql-kw">DESC</span>
      </div>
      <div className="sql-output-actions">
        <button className="rc-act" style={{ background: 'linear-gradient(135deg,#1a4a3a,#2a6a4a)', color: 'var(--green)', border: 'none' }}>▶️ 执行</button>
        <button className="rc-act">💾 保存到项目</button>
        <div className="insert-dropdown-wrap">
          <button className="rc-act" onClick={() => setShowInsert(v => !v)}>📌 插入到文件</button>
          {showInsert && <InsertDropdown onClose={() => setShowInsert(false)} />}
        </div>
        <button className="rc-act primary">📝 编辑器打开</button>
        <button className="rc-act">📋 复制</button>
      </div>
    </div>
  )
}

function SqlOutputExecuted() {
  const [showInsert, setShowInsert] = useState(false)
  const rows = [
    { channel: '自然搜索', dt: '2026-03-19', dau: '182,340' },
    { channel: '信息流广告', dt: '2026-03-19', dau: '95,120' },
    { channel: '直接访问', dt: '2026-03-19', dau: '67,890' },
    { channel: '社交分享', dt: '2026-03-19', dau: '34,560' },
  ]
  return (
    <div className="sql-output animate-slide">
      <div className="sql-output-header">
        <span>📄 SQL · 按渠道拆分 DAU</span>
        <span className="sql-output-status executed">✓ 已执行 · 1.8s</span>
      </div>
      <div className="sql-output-code" style={{ maxHeight: 80, overflow: 'hidden', position: 'relative' }}>
        <span className="sql-kw">SELECT</span> channel, dt, <span className="sql-fn">COUNT</span>(<span className="sql-kw">DISTINCT</span> user_id) <span className="sql-kw">AS</span> dau
        {'\n'}<span className="sql-kw">FROM</span> dw.fact_active_user <span className="sql-kw">WHERE</span> dt ...
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 30, background: 'linear-gradient(transparent, var(--bg-2))' }} />
      </div>
      <div className="sql-output-result">
        <div className="sql-output-result-header">
          <span style={{ color: 'var(--green)' }}>✓</span> 查询结果 · 12 行 × 3 列 · 1.8s
        </div>
        <div style={{ padding: '0 14px 8px', overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11, fontFamily: 'var(--mono)' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                <th style={{ textAlign: 'left', padding: '5px 6px', color: 'var(--text-4)', fontWeight: 500 }}>channel</th>
                <th style={{ textAlign: 'left', padding: '5px 6px', color: 'var(--text-4)', fontWeight: 500 }}>dt</th>
                <th style={{ textAlign: 'right', padding: '5px 6px', color: 'var(--text-4)', fontWeight: 500 }}>dau</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(r => (
                <tr key={r.channel} style={{ borderBottom: '1px solid rgba(34,37,56,0.5)' }}>
                  <td style={{ padding: '4px 6px', color: 'var(--text-2)' }}>{r.channel}</td>
                  <td style={{ padding: '4px 6px', color: 'var(--text-3)' }}>{r.dt}</td>
                  <td style={{ textAlign: 'right', padding: '4px 6px', color: 'var(--text-1)' }}>{r.dau}</td>
                </tr>
              ))}
              <tr>
                <td colSpan={3} style={{ padding: '4px 6px', color: 'var(--text-4)', textAlign: 'center', fontSize: 10, fontFamily: 'var(--sans)' }}>... 还有 8 行</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div className="sql-output-actions">
        <button className="rc-act">💾 保存到项目</button>
        <button className="rc-act">📁 保存到临时</button>
        <div className="insert-dropdown-wrap">
          <button className="rc-act" onClick={() => setShowInsert(v => !v)}>📌 插入到文件</button>
          {showInsert && <InsertDropdown onClose={() => setShowInsert(false)} />}
        </div>
        <button className="rc-act primary">📝 编辑器打开</button>
        <button className="rc-act">📥 导出CSV</button>
        <button className="rc-act">📊 转图表</button>
      </div>
    </div>
  )
}

// ─── Main Panel B content ──────────────────────────────────────────────────

export default function PanelBContent() {
  const { messages, addMessage } = useChatStore()
  const [showWarning, setShowWarning] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (messagesEndRef.current && typeof messagesEndRef.current.scrollIntoView === 'function') {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages])

  return (
    <>
      <div className="pb-header">
        <div className="pb-title">🤖 GMV归因分析</div>
        <button className="pb-header-btn">⚙️ 执行偏好</button>
        <button className="pb-header-btn">···</button>
      </div>

      <div className="pb-messages">
        {showWarning && <TokenWarning onDismiss={() => setShowWarning(false)} />}

        {/* Demo conversation */}
        <div className="msg user">
          <div className="msg-who">👤 用户</div>
          <div className="bubble bubble-user">上个月 GMV 为什么下降了？按品类拆分看看</div>
        </div>

        <ProgressSteps open={true} />

        <div className="msg ai"><div className="msg-who">🤖 分析助手 · 最终输出</div></div>
        <ResultCardText />
        <ResultCardChart />
        <ResultCardTable />

        <div className="quick-chips">
          <button className="rc-act" style={{ fontSize: 12 }}>🔍 深入3C数码</button>
          <button className="rc-act" style={{ fontSize: 12 }}>📈 查看近6个月趋势</button>
          <button className="rc-act" style={{ fontSize: 12 }}>📄 生成完整报告</button>
        </div>

        <div className="msg-divider" />

        {/* Second conversation */}
        <div className="msg user">
          <div className="msg-who">👤 用户</div>
          <div className="bubble bubble-user">帮我写一个按渠道拆分日活 DAU 的 SQL</div>
        </div>

        <ProgressSteps open={false} />
        <SqlOutputPending />

        <div className="msg-divider" />

        <div className="msg user">
          <div className="msg-who">👤 用户</div>
          <div className="bubble bubble-user">跑一下，看看结果</div>
        </div>
        <SqlOutputExecuted />

        {/* User-sent messages */}
        {messages.map(msg => (
          <div key={msg.id} className={`msg ${msg.role === 'user' ? 'user' : 'ai'}`}>
            <div className="msg-who">{msg.role === 'user' ? '👤 用户' : '🤖 分析助手'}</div>
            <div className={`bubble ${msg.role === 'user' ? 'bubble-user' : 'bubble-ai'}`}>
              {msg.content}
            </div>
          </div>
        ))}

        <div ref={messagesEndRef} />
      </div>

      <PanelBInput />
    </>
  )
}

// ─── Input (inline to avoid circular import) ──────────────────────────────

const SLASH_COMMANDS = [
  { cmd: '/compress', desc: '压缩当前会话历史记录', group: 'Skills' },
  { cmd: '/chart', desc: '生成可视化图表', group: 'Skills' },
  { cmd: '/report', desc: '生成分析报告', group: 'Skills' },
  { cmd: '/trend', desc: '时序趋势分析', group: 'Skills' },
  { cmd: '/sql', desc: '直接编写并执行 SQL', group: 'Commands' },
  { cmd: '/export', desc: '导出当前会话为文档', group: 'Commands' },
  { cmd: '/datasource', desc: '切换数据源连接', group: 'Commands' },
]

const TOKEN_PCT = 0.811
const CIRCUMFERENCE = 56.55

function PanelBInput() {
  const [value, setValue] = useState('')
  const [mode, setMode] = useState<'Agent' | 'Plan'>('Agent')
  const [showSlash, setShowSlash] = useState(false)
  const { addMessage } = useChatStore()
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const slashFilter = value.startsWith('/') ? value.slice(1).toLowerCase() : ''
  const filteredCmds = SLASH_COMMANDS.filter(c => c.cmd.toLowerCase().includes(slashFilter))
  const skills = filteredCmds.filter(c => c.group === 'Skills')
  const commands = filteredCmds.filter(c => c.group === 'Commands')

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const v = e.target.value
    setValue(v)
    setShowSlash(v.startsWith('/') && v.length < 15)
    const ta = textareaRef.current
    if (ta) { ta.style.height = 'auto'; ta.style.height = Math.min(ta.scrollHeight, 200) + 'px' }
  }

  const handleSend = () => {
    if (!value.trim()) return
    addMessage({
      id: crypto.randomUUID(),
      role: 'user',
      content_type: 'text',
      content: value.trim(),
      metadata: null,
      created_at: new Date().toISOString(),
    })
    setValue('')
    setShowSlash(false)
    if (textareaRef.current) textareaRef.current.style.height = 'auto'
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Escape') setShowSlash(false)
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      if (showSlash) return
      handleSend()
    }
  }

  const selectSlash = (cmd: string) => {
    setValue(cmd + ' ')
    setShowSlash(false)
    textareaRef.current?.focus()
  }

  const dashOffset = CIRCUMFERENCE - TOKEN_PCT * CIRCUMFERENCE

  return (
    <div className="pb-input-wrap">
      <div className="input-drag-bar"><div className="input-drag-bar-line" /></div>
      <div className="input-box">
        {showSlash && (
          <div className="slash-menu show">
            {skills.length > 0 && (
              <>
                <div className="slash-group-label">Skills</div>
                {skills.map(c => (
                  <div key={c.cmd} className="slash-item" onClick={() => selectSlash(c.cmd)}>
                    <div className="slash-item-name">{c.cmd}</div>
                    <div className="slash-item-desc">{c.desc}</div>
                  </div>
                ))}
              </>
            )}
            {commands.length > 0 && (
              <>
                <div className="slash-sep" />
                <div className="slash-group-label">Commands</div>
                {commands.map(c => (
                  <div key={c.cmd} className="slash-item" onClick={() => selectSlash(c.cmd)}>
                    <div className="slash-item-name">{c.cmd}</div>
                    <div className="slash-item-desc">{c.desc}</div>
                  </div>
                ))}
              </>
            )}
            <div className="slash-sep" />
            <div className="slash-footer">＋ Add Skills</div>
          </div>
        )}
        <textarea
          ref={textareaRef}
          data-testid="message-input"
          className="input-textarea"
          placeholder="输入你的分析问题... 支持 📎附件  @引用文件  /快捷指令"
          value={value}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          rows={1}
        />
        <div className="input-toolbar">
          <div className="input-left">
            <div className="mode-select" onClick={() => setMode(m => m === 'Agent' ? 'Plan' : 'Agent')}>
              {mode === 'Agent' ? '🤖 Agent ▾' : '📋 Plan ▾'}
            </div>
            <div className="model-select">GPT-4o ▾</div>
          </div>
          <div className="input-right">
            <div className="token-ring">
              <svg viewBox="0 0 24 24">
                <circle className="token-ring-bg" cx="12" cy="12" r="9" />
                <circle
                  className="token-ring-fg"
                  cx="12" cy="12" r="9"
                  stroke="var(--orange)"
                  strokeDasharray={CIRCUMFERENCE}
                  strokeDashoffset={dashOffset}
                />
              </svg>
              <div className="token-tooltip">81.1% · 103.8K / 128K 上下文</div>
            </div>
            <button className="img-upload-btn" title="上传图片">🖼️</button>
            <button
              data-testid="send-btn"
              className="send-btn"
              onClick={handleSend}
              disabled={!value.trim()}
              title="发送 (Enter)"
            >➤</button>
          </div>
        </div>
      </div>
    </div>
  )
}
