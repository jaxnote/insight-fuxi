import { menuConfig } from '../config/menuConfig'
import NavDropdown from './NavDropdown'
import UserAvatar from './UserAvatar'

export default function GlobalNav() {
  return (
      <nav className="global-nav" aria-label="主导航" data-testid="global-nav">
      <div className="global-nav-logo">
        <img
          src="/logo.png"
          alt="InsightFuxi logo"
          onError={(e) => {
            ;(e.currentTarget as HTMLImageElement).style.display = 'none'
          }}
        />
        <span className="global-nav-logo-text">InsightFuxi</span>
      </div>

      <div className="global-nav-menu">
        {menuConfig.map((item) => (
          <NavDropdown key={item.key} item={item} />
        ))}
      </div>

      <UserAvatar />
    </nav>
  )
}
