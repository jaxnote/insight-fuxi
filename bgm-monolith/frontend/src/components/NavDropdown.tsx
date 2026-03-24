import { useState, useCallback } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import type { MenuItem } from '../config/menuConfig'

interface Props {
  item: MenuItem
}

export default function NavDropdown({ item }: Props) {
  const location = useLocation()
  const [open, setOpen] = useState(false)

  const isChildActive =
    item.children?.some(
      (child) => child.path && (
        location.pathname === child.path ||
        location.pathname.startsWith(child.path + '/')
      )
    ) ?? false

  const openMenu = useCallback(() => setOpen(true), [])
  const closeMenu = useCallback(() => setOpen(false), [])
  const toggleMenu = useCallback(() => setOpen((v) => !v), [])

  if (!item.children || item.children.length === 0) {
    return (
      <div className="nav-item">
        <NavLink
          to={item.path ?? '/'}
          className={({ isActive }) =>
            `nav-link${isActive ? ' active' : ''}${item.disabled ? ' disabled' : ''}`
          }
          aria-disabled={item.disabled}
          onClick={item.disabled ? (e) => e.preventDefault() : undefined}
        >
          {item.icon && <span className="nav-item-icon">{item.icon}</span>}
          {item.label}
        </NavLink>
      </div>
    )
  }

  return (
    <div
      className={`nav-item nav-dropdown-wrap${open ? ' open' : ''}`}
      onMouseEnter={openMenu}
      onMouseLeave={closeMenu}
    >
      <button
        className={`nav-dropdown-trigger${isChildActive ? ' active' : ''}`}
        type="button"
        aria-haspopup="true"
        aria-expanded={open}
        onFocus={openMenu}
        onBlur={closeMenu}
        onClick={toggleMenu}
        onKeyDown={(e) => {
          if (e.key === 'Escape') closeMenu()
        }}
      >
        {item.icon && <span className="nav-item-icon">{item.icon}</span>}
        {item.label}
        <span className="nav-dropdown-arrow">▾</span>
      </button>
      <div className="nav-dropdown-panel">
        {item.children.map((child) => (
          <NavLink
            key={child.key}
            to={child.path ?? '/'}
            className={({ isActive }) =>
              `nav-dropdown-item${isActive ? ' active' : ''}`
            }
            onFocus={openMenu}
            onBlur={closeMenu}
          >
            {child.label}
          </NavLink>
        ))}
      </div>
    </div>
  )
}
