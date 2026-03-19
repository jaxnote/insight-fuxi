const NAV_ITEMS = [
  { section: '工作台', items: [
    { id: 'home', label: '首页', icon: '🏠', page: 'index.html' },
  ]},
  { section: '分析', items: [
    { id: 'chat', label: '对话分析', icon: '💬', page: 'chat.html', badge: '' },
    { id: 'report', label: '报告中心', icon: '📊', page: 'report.html' },
  ]},
  { section: '能力注册', items: [
    { id: 'agents', label: 'Agent 管理', icon: '🤖', page: 'agents.html' },
    { id: 'skills', label: 'Skill 管理', icon: '⚡', page: 'skills.html' },
  ]},
  { section: '编排调度', items: [
    { id: 'team', label: 'Team 设计', icon: '👥', page: 'team.html' },
    { id: 'workflow', label: '工作流程', icon: '🔄', page: 'workflow.html' },
    { id: 'bizflow', label: '业务流程', icon: '📐', page: 'bizflow.html' },
    { id: 'task', label: '任务管理', icon: '📋', page: 'task.html' },
    { id: 'worklog', label: '工作日志', icon: '📝', page: 'worklog.html' },
    { id: 'tasklog', label: '任务日志', icon: '📜', page: 'tasklog.html' },
  ]},
  { section: '数据', items: [
    { id: 'semantic', label: '语义层管理', icon: '🧠', page: 'semantic.html' },
    { id: 'datasource', label: '数据源管理', icon: '🗄️', page: 'datasource.html' },
  ]},
  { section: '管理', items: [
    { id: 'ops', label: '平台运维', icon: '⚙️', page: 'ops.html' },
  ]},
];

function renderSidebar(activeId) {
  let html = `
    <div class="sidebar-logo">
      <div class="logo-icon">F</div>
      <span>Insight-Fuxi</span>
    </div>
    <nav class="sidebar-nav">
  `;
  NAV_ITEMS.forEach(section => {
    html += `<div class="nav-section"><div class="nav-section-title">${section.section}</div>`;
    section.items.forEach(item => {
      const isActive = item.id === activeId ? ' active' : '';
      const badge = item.badge ? `<span class="nav-badge">${item.badge}</span>` : '';
      html += `<a href="${item.page}" class="nav-item${isActive}">
        <span class="nav-icon">${item.icon}</span>
        <span>${item.label}</span>
        ${badge}
      </a>`;
    });
    html += `</div>`;
  });
  html += `</nav>`;
  return html;
}

function renderHeader(breadcrumbs) {
  const crumbs = breadcrumbs.map((b, i) => {
    if (i === breadcrumbs.length - 1) {
      return `<span class="current">${b}</span>`;
    }
    return `<span>${b}</span><span class="separator">/</span>`;
  }).join('');

  return `
    <div class="header-breadcrumb">${crumbs}</div>
    <div class="header-actions">
      <div class="header-search" onclick="alert('搜索功能开发中')">
        <span>🔍</span>
        <span>搜索...</span>
        <kbd>⌘K</kbd>
      </div>
      <button class="theme-toggle" onclick="toggleTheme()" title="切换主题">🌓</button>
      <div class="avatar" title="管理员">A</div>
    </div>
  `;
}

function initPage(activeId, breadcrumbs) {
  const sidebar = document.getElementById('sidebar');
  const header = document.getElementById('header');
  if (sidebar) sidebar.innerHTML = renderSidebar(activeId);
  if (header) header.innerHTML = renderHeader(breadcrumbs);

  const savedTheme = localStorage.getItem('theme') || 'dark';
  if (savedTheme === 'light') {
    document.documentElement.setAttribute('data-theme', 'light');
  }
}

function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme');
  const next = current === 'light' ? '' : 'light';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('theme', next || 'dark');
}

function animateNumber(el, target, duration = 800) {
  const start = 0;
  const startTime = performance.now();
  function update(now) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(start + (target - start) * eased).toLocaleString();
    if (progress < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}

function createMiniChart(container, data, color) {
  const w = container.clientWidth;
  const h = container.clientHeight || 40;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const step = w / (data.length - 1);
  const points = data.map((v, i) => `${i * step},${h - ((v - min) / range) * (h - 4) - 2}`).join(' ');

  container.innerHTML = `
    <svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
      <polyline points="${points}" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`;
}
