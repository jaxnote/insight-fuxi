export interface MenuItem {
  key: string
  label: string
  path?: string
  icon?: string
  children?: MenuItem[]
  disabled?: boolean
}

export const menuConfig: MenuItem[] = [
  {
    key: 'nl-analysis',
    label: '问答对话',
    path: '/nl-analysis',
    icon: '💬',
  },
  {
    key: 'plugins',
    label: '插件管理',
    icon: '🔌',
    children: [
      { key: 'agents', label: 'Agent管理', path: '/plugins/agents' },
      { key: 'skills', label: 'Skills管理', path: '/plugins/skills' },
      { key: 'rules', label: 'Rules管理', path: '/plugins/rules' },
      { key: 'prompts', label: 'Prompt管理', path: '/plugins/prompts' },
      { key: 'models', label: '模型管理', path: '/plugins/models' },
      { key: 'templates', label: '模板管理', path: '/plugins/templates' },
    ],
  },
  {
    key: 'projects',
    label: '项目仓库',
    path: '/projects',
    icon: '📦',
  },
  {
    key: 'dashboard',
    label: '智能体看板',
    icon: '📊',
    children: [
      { key: 'progress', label: '进度管理', path: '/dashboard/progress' },
      { key: 'cost', label: '成本管理', path: '/dashboard/cost' },
      { key: 'performance', label: '绩效管理', path: '/dashboard/performance' },
    ],
  },
  {
    key: 'control',
    label: '智能体控制',
    icon: '🎛️',
    children: [
      { key: 'teams', label: '智能体团队', path: '/control/teams' },
      { key: 'scheduling', label: '调度流程', path: '/control/scheduling' },
      { key: 'monitoring', label: '调度监控', path: '/control/monitoring' },
      { key: 'insights', label: '洞察推送', path: '/control/insights' },
    ],
  },
  {
    key: 'settings',
    label: '系统设置',
    icon: '⚙️',
    children: [
      { key: 'memory', label: '记忆管理', path: '/settings/memory' },
      { key: 'knowledge', label: '知识库管理', path: '/settings/knowledge' },
      { key: 'channels', label: '频道管理', path: '/settings/channels' },
      { key: 'users', label: '用户管理', path: '/settings/users' },
    ],
  },
]
