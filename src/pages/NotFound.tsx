import { Link } from 'react-router-dom'
import { ROUTES } from '../constants/routes'
import './NotFound.css'

function NotFound() {
  return (
    <div className="page not-found">
      <h1>404</h1>
      <h2>Page Not Found</h2>
      <p>The page you're looking for doesn't exist.</p>
      <Link to={ROUTES.HOME} className="home-link">Go Home</Link>
    </div>
  )
}

export default NotFound
