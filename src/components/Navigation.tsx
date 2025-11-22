import { NavLink } from 'react-router-dom'
import { useCounterStore } from '../store/counterStore'
import './Navigation.css'

function Navigation() {
  const count = useCounterStore((state) => state.count)

  return (
    <nav className="navigation">
      <div className="nav-container">
        <div className="nav-brand">
          <h2>Fallout App</h2>
          <span className="counter-badge">{count}</span>
        </div>
        <ul className="nav-links">
          <li>
            <NavLink to="/" end>
              Home
            </NavLink>
          </li>
          <li>
            <NavLink to="/about">
              About
            </NavLink>
          </li>
        </ul>
      </div>
    </nav>
  )
}

export default Navigation
