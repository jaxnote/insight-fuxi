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
    icon: 'MessageSquare',
  },
  {
    key: 'plugins',
    label: '插件管理',
    icon: 'Blocks',
    children: [
      { key: 'agents', label: 'Agent管理', path: '/plugins/agents', icon: 'Bot' },
      { key: 'skills', label: 'Skills管理', path: '/plugins/skills', icon: 'Zap' },
      { key: 'rules', label: 'Rules管理', path: '/plugins/rules', icon: 'FileCode2' },
      { key: 'prompts', label: 'Prompt管理', path: '/plugins/prompts', icon: 'TerminalSquare' },
      { key: 'models', label: '模型管理', path: '/plugins/models', icon: 'Cpu' },
      { key: 'templates', label: '模板管理', path: '/plugins/templates', icon: 'LayoutTemplate' },
    ],
  },
  {
    key: 'projects',
    label: '项目仓库',
    path: '/projects',
    icon: 'Database',
  },
  {
    key: 'dashboard',
    label: '智能体看板',
    icon: 'LayoutDashboard',
    children: [
      { key: 'progress', label: '进度管理', path: '/dashboard/progress', icon: 'TrendingUp' },
      { key: 'cost', label: '成本管理', path: '/dashboard/cost', icon: 'CircleDollarSign' },
      { key: 'performance', label: '绩效管理', path: '/dashboard/performance', icon: 'Activity' },
    ],
  },
  {
    key: 'control',
    label: '智能体控制',
    icon: 'Sliders',
    children: [
      { key: 'teams', label: '智能体团队', path: '/control/teams', icon: 'Users' },
      { key: 'scheduling', label: '调度流程', path: '/control/scheduling', icon: 'GitMerge' },
      { key: 'monitoring', label: '调度监控', path: '/control/monitoring', icon: 'Monitor' },
      { key: 'insights', label: '洞察推送', path: '/control/insights', icon: 'Lightbulb' },
    ],
  },
  {
    key: 'settings',
    label: '系统设置',
    icon: 'Settings',
    children: [
      { key: 'memory', label: '记忆管理', path: '/settings/memory', icon: 'BrainCircuit' },
      { key: 'knowledge', label: '知识库管理', path: '/settings/knowledge', icon: 'BookOpen' },
      { key: 'channels', label: '频道管理', path: '/settings/channels', icon: 'Hash' },
      { key: 'users', label: '用户管理', path: '/settings/users', icon: 'UserCog' },
    ],
  },
]
