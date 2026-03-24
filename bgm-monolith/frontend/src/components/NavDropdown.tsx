import { NavLink, useLocation } from 'react-router-dom'
import type { MenuItem } from '../config/menuConfig'

interface Props {
  item: MenuItem
}

export default function NavDropdown({ item }: Props) {
  const location = useLocation()

  const isChildActive =
    item.children?.some(
      (child) => child.path && location.pathname.startsWith(child.path)
    ) ?? false

  if (!item.children || item.children.length === 0) {
    return (
      <div className="nav-item">
        <NavLink
          to={item.path ?? '/'}
          className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
        >
          {item.icon && <span className="nav-item-icon">{item.icon}</span>}
          {item.label}
        </NavLink>
      </div>
    )
  }

  return (
    <div className="nav-item nav-dropdown-wrap">
      <button
        className={`nav-dropdown-trigger${isChildActive ? ' active' : ''}`}
        type="button"
        aria-haspopup="true"
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
          >
            {child.label}
          </NavLink>
        ))}
      </div>
    </div>
  )
}
