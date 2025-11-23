import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { useCounterStore } from '../store/counterStore'
import { ROUTES } from '../constants/routes'
import ThemeToggle from './ThemeToggle'
import './Navigation.css'

function Navigation() {
  const count = useCounterStore((state) => state.count)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleSkipToContent = () => {
    const mainContent = document.getElementById('main-content')
    if (mainContent) {
      mainContent.focus()
      mainContent.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  const closeMobileMenu = () => {
    setMobileMenuOpen(false)
  }

  const navItems = [
    { to: ROUTES.HOME, label: 'Home', icon: '🏠' },
    { to: ROUTES.DASHBOARD, label: 'Dashboard', icon: '📊' },
    { to: ROUTES.QUESTS, label: 'Quests', icon: '⚔️' },
    { to: ROUTES.NPCS, label: 'NPCs', icon: '👥' },
    { to: ROUTES.POSTS, label: 'Posts', icon: '📝' },
    { to: ROUTES.PROFILE, label: 'Profile', icon: '👤' },
    { to: ROUTES.SETTINGS, label: 'Settings', icon: '⚙️' },
    { to: ROUTES.ABOUT, label: 'About', icon: 'ℹ️' },
    { to: ROUTES.COMPENDIUM, label: 'Compendium', icon: '📚' },
    { to: ROUTES.CHARACTERS, label: 'Characters', icon: '🎭' },
  ]

  return (
    <>
      <nav className="navigation" aria-label="Main navigation">
        <a
          href="#main-content"
          className="skip-to-content"
          onClick={(e) => {
            e.preventDefault()
            handleSkipToContent()
          }}
        >
          Skip to main content
        </a>
        <div className="nav-container">
          <div className="nav-brand">
            <h2>Fallout App</h2>
            <span className="counter-badge" aria-label={`Counter: ${count}`}>
              {count}
            </span>
          </div>

          {/* Desktop Navigation */}
          <ul className="nav-links desktop-nav" role="menubar">
            {navItems.map((item) => (
              <li key={item.to} role="none">
                <NavLink
                  to={item.to}
                  end={item.to === ROUTES.HOME}
                  role="menuitem"
                  aria-label={`Go to ${item.label.toLowerCase()}`}
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>

          {/* Mobile Hamburger Button */}
          <button
            className="mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle mobile menu"
            aria-expanded={mobileMenuOpen}
          >
            <span className="hamburger-icon">
              <span className="hamburger-line"></span>
              <span className="hamburger-line"></span>
              <span className="hamburger-line"></span>
            </span>
          </button>

          <ThemeToggle />
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="mobile-menu">
            <ul className="mobile-nav-links" role="menubar">
              {navItems.map((item) => (
                <li key={item.to} role="none">
                  <NavLink
                    to={item.to}
                    end={item.to === ROUTES.HOME}
                    role="menuitem"
                    className="mobile-nav-link"
                    onClick={closeMobileMenu}
                  >
                    <span className="nav-icon">{item.icon}</span>
                    <span className="nav-label">{item.label}</span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        )}
      </nav>

      {/* Mobile Bottom Navigation */}
      <nav className="bottom-navigation" aria-label="Mobile navigation">
        <ul className="bottom-nav-links" role="menubar">
          {navItems.map((item) => (
            <li key={item.to} role="none">
              <NavLink
                to={item.to}
                end={item.to === ROUTES.HOME}
                role="menuitem"
                className="bottom-nav-link"
                title={item.label}
              >
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-label">{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </>
  )
}

export default Navigation
