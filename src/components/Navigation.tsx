import { NavLink } from 'react-router-dom'
import { useCounterStore } from '../store/counterStore'
import { ROUTES } from '../constants/routes'
import ThemeToggle from './ThemeToggle'
import './Navigation.css'

function Navigation() {
  const count = useCounterStore((state) => state.count)

  const handleSkipToContent = () => {
    const mainContent = document.getElementById('main-content')
    if (mainContent) {
      mainContent.focus()
      mainContent.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
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
        <ul className="nav-links" role="menubar">
          <li role="none">
            <NavLink to={ROUTES.HOME} end role="menuitem" aria-label="Go to home page">
              Home
            </NavLink>
          </li>
          <li role="none">
            <NavLink to={ROUTES.DASHBOARD} role="menuitem" aria-label="Go to dashboard">
              Dashboard
            </NavLink>
          </li>
          <li role="none">
            <NavLink to={ROUTES.POSTS} role="menuitem" aria-label="Go to posts">
              Posts
            </NavLink>
          </li>
          <li role="none">
            <NavLink to={ROUTES.PROFILE} role="menuitem" aria-label="Go to profile">
              Profile
            </NavLink>
          </li>
          <li role="none">
            <NavLink to={ROUTES.SETTINGS} role="menuitem" aria-label="Go to settings">
              Settings
            </NavLink>
          </li>
          <li role="none">
            <NavLink to={ROUTES.ABOUT} role="menuitem" aria-label="Go to about page">
              About
            </NavLink>
          </li>
        </ul>
        <ThemeToggle />
      </div>
    </nav>
  )
}

export default Navigation
