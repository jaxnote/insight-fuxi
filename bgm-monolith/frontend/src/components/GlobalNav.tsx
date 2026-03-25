import { useState, useEffect, useRef } from 'react'
import { menuConfig } from '../config/menuConfig'
import NavDropdown from './NavDropdown'
import UserAvatar from './UserAvatar'

export default function GlobalNav() {
  const [theme, setTheme] = useState('theme-cyber')
  const [isThemeOpen, setIsThemeOpen] = useState(false)
  const themeRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Remove old themes
    document.body.classList.remove('theme-corporate', 'theme-cyber', 'theme-saas')
    // Add new theme
    document.body.classList.add(theme)
  }, [theme])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (themeRef.current && !themeRef.current.contains(event.target as Node)) {
        setIsThemeOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const themeOptions = [
    { id: 'theme-corporate', name: '商务风', style: { background: '#0F172A', border: '2px solid #334155' } },
    { id: 'theme-cyber', name: '科技风', style: { background: 'linear-gradient(135deg, #00F0FF, #8B5CF6)', border: '2px solid rgba(0, 240, 255, 0.5)', boxShadow: '0 0 8px rgba(0, 240, 255, 0.5)' } },
    { id: 'theme-saas', name: '现代SaaS风', style: { background: '#FFFFFF', border: '2px solid #E2E8F0' } }
  ]

  const currentThemeOption = themeOptions.find(t => t.id === theme) || themeOptions[1]

  return (
    <nav className="global-nav" aria-label="主导航" data-testid="global-nav">
      <div className="global-nav-logo">
        <img src="/assets/logo.png" alt="InsightFuxi Logo" className="global-nav-logo-img" />
        <span className="global-nav-logo-text">InsightFuxi</span>
      </div>

      <div className="global-nav-menu">
        {menuConfig.map((item) => (
          <NavDropdown key={item.key} item={item} />
        ))}
      </div>

      <div className="nav-right-actions">
        <div className="theme-switcher" ref={themeRef}>
          <button 
            className={`theme-btn ${isThemeOpen ? 'active' : ''}`}
            onClick={() => setIsThemeOpen(!isThemeOpen)}
            title="切换主题"
            aria-label="切换主题"
            aria-expanded={isThemeOpen}
          >
            <div style={{ width: 16, height: 16, borderRadius: '50%', ...currentThemeOption.style }} />
          </button>
          
          {isThemeOpen && (
            <div className="theme-dropdown-panel">
              {themeOptions.map(option => (
                <button
                  key={option.id}
                  className={`theme-dropdown-item ${theme === option.id ? 'active' : ''}`}
                  onClick={() => {
                    setTheme(option.id)
                    setIsThemeOpen(false)
                  }}
                  title={option.name}
                >
                  <div style={{ width: 16, height: 16, borderRadius: '50%', ...option.style }} />
                  <span>{option.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>
        <UserAvatar />
      </div>
    </nav>
  )
}
