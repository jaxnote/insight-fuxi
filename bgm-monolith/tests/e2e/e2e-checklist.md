# E2E 验证清单（Cursor Browser MCP 执行）

> 执行方式：启动 browser-use subagent，按序执行以下验证步骤。
> 每个步骤使用 browser_snapshot 截图确认结果。

## 前置条件
- `cd bgm-monolith && docker compose up -d`（后端 + MySQL 启动）
- `cd bgm-monolith/frontend && npm run dev`（前端 dev server 启动）

---

## Flow 1: 自然语言分析完整流程

### 1.1 页面加载
- [ ] browser_navigate → http://localhost:5173/nl-analysis
- [ ] browser_snapshot → 验证：四面板布局渲染（Panel B 可见）
- [ ] 验证：左侧导航存在 "nl-analysis" 菜单项

### 1.2 创建新会话
- [ ] browser_click → "New Agent" 按钮
- [ ] browser_snapshot → 验证：Panel B 出现空对话区 + 输入框

### 1.3 发送消息
- [ ] browser_fill → 输入框填入 "上月GMV为什么下降"
- [ ] browser_click → 发送按钮
- [ ] browser_wait_for → 等待消息出现在列表中
- [ ] browser_snapshot → 验证：用户消息已渲染

### 1.4 步骤折叠/展开
- [ ] browser_snapshot → 验证：Panel B 消息区存在

### 1.5 Token 进度显示
- [ ] browser_snapshot → 验证：InputArea 可见

---

## Flow 2: 面板交互

### 2.1 Panel A 展开/折叠
- [ ] browser_click → 顶部 Panel A toggle 按钮 [data-testid=toggle-panel-a]
- [ ] browser_snapshot → 验证：Panel A（会话历史）滑入 [data-testid=panel-a]
- [ ] browser_click → 再次点击 [data-testid=toggle-panel-a]
- [ ] browser_snapshot → 验证：Panel A 折叠

### 2.2 Panel D 展开/折叠
- [ ] browser_click → 顶部 Panel D toggle 按钮 [data-testid=toggle-panel-d]
- [ ] browser_snapshot → 验证：Panel D（文件树）滑入 [data-testid=panel-d]
- [ ] 验证：项目搜索下拉可见 [data-testid=project-selector]

### 2.3 Panel C 展开
- [ ] browser_click → [data-testid=toggle-panel-c]
- [ ] browser_snapshot → 验证：编辑器预览区出现 [data-testid=editor-preview]

---

## Flow 3: 会话历史管理

### 3.1 搜索
- [ ] 先展开 Panel A（[data-testid=toggle-panel-a]）
- [ ] browser_fill → [data-testid=search-input] 填入关键字
- [ ] browser_snapshot → 验证：会话列表过滤

### 3.2 新建会话
- [ ] browser_click → [data-testid=new-agent-btn]
- [ ] browser_snapshot → 验证：新会话出现

---

## Flow 4: 输入区交互

### 4.1 文本输入
- [ ] browser_fill → [data-testid=message-input] 填入 "测试消息"
- [ ] browser_snapshot → 验证：输入框有内容

### 4.2 发送消息
- [ ] browser_click → [data-testid=send-btn]
- [ ] browser_snapshot → 验证：用户消息出现在 ChatArea

---

## Flow 5: 完整分析流程（需后端运行）

### 5.1 启动环境
- [ ] 确认后端 http://localhost:8000/health 返回 200
- [ ] 确认前端 http://localhost:5173 可访问

### 5.2 端到端验证
- [ ] browser_navigate → http://localhost:5173/nl-analysis
- [ ] browser_fill → 输入框填入 "上月GMV分析"
- [ ] browser_click → 发送按钮
- [ ] browser_wait_for → 等待响应（最多 30s）
- [ ] browser_snapshot → 验证：AI 响应出现

---

## 结果记录

| Flow | 步骤数 | 状态 | 备注 |
|------|--------|------|------|
| Flow 1: 页面基础 | 5 | ⬜ 待验证 | |
| Flow 2: 面板交互 | 6 | ⬜ 待验证 | |
| Flow 3: 会话历史 | 4 | ⬜ 待验证 | |
| Flow 4: 输入区 | 4 | ⬜ 待验证 | |
| Flow 5: 完整流程 | 5 | ⬜ 待验证 | 需后端 |
