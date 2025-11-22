import { Link } from 'react-router-dom'
import { useCounterStore } from '../store/counterStore'
import './Home.css'

function Home() {
  const count = useCounterStore((state) => state.count)

  const features = [
    {
      title: 'Dashboard',
      description: 'View key metrics, recent activity, and get an overview of your application data.',
      icon: '📊',
      link: '/dashboard',
      color: '#667eea',
    },
    {
      title: 'Posts',
      description: 'Browse posts with pagination or infinite scroll. Seamlessly switch between views.',
      icon: '📝',
      link: '/posts',
      color: '#f093fb',
    },
    {
      title: 'Profile',
      description: 'Manage your user profile, view stats, and update your account information.',
      icon: '👤',
      link: '/profile',
      color: '#4facfe',
    },
    {
      title: 'Settings',
      description: 'Customize your preferences, manage notifications, and configure your experience.',
      icon: '⚙️',
      link: '/settings',
      color: '#43e97b',
    },
  ]

  const stats = [
    { label: 'Total Users', value: '1,234', trend: '+12%' },
    { label: 'Active Posts', value: '100', trend: '+8%' },
    { label: 'Counter Value', value: count, trend: '0%' },
    { label: 'Uptime', value: '99.9%', trend: '+0.1%' },
  ]

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1 className="hero-title">Fallout Web App</h1>
          <p className="hero-subtitle">
            A modern React application demonstrating best practices with TypeScript,
            React Query, Zustand, and more.
          </p>
          <div className="hero-buttons">
            <Link to="/dashboard" className="btn-primary">
              Get Started
            </Link>
            <Link to="/about" className="btn-secondary">
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="stats-grid">
          {stats.map((stat, index) => (
            <div key={index} className="stat-card">
              <div className="stat-value">{stat.value}</div>
              <div className="stat-label">{stat.label}</div>
              <div className="stat-trend">{stat.trend}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <h2 className="section-title">Explore Features</h2>
        <p className="section-subtitle">
          Discover the powerful features built with modern web technologies
        </p>

        <div className="features-grid">
          {features.map((feature, index) => (
            <Link
              key={index}
              to={feature.link}
              className="feature-card"
              style={{ '--accent-color': feature.color } as React.CSSProperties}
            >
              <div className="feature-icon">{feature.icon}</div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">{feature.description}</p>
              <div className="feature-arrow">→</div>
            </Link>
          ))}
        </div>
      </section>

      {/* Tech Stack Section */}
      <section className="tech-section">
        <h2 className="section-title">Built With Modern Tech</h2>
        <div className="tech-grid">
          <div className="tech-badge">React 18</div>
          <div className="tech-badge">TypeScript</div>
          <div className="tech-badge">Vite</div>
          <div className="tech-badge">React Query</div>
          <div className="tech-badge">Zustand</div>
          <div className="tech-badge">React Router</div>
          <div className="tech-badge">Axios</div>
          <div className="tech-badge">ESLint</div>
        </div>
      </section>
    </div>
  )
}

export default Home
