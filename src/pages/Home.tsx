import { useMemo, forwardRef } from 'react'
import { Link } from 'react-router-dom'
import { useCounterStore } from '../store/counterStore'
import { useScrollAnimation } from '../hooks/useScrollAnimation'
import './Home.css'

interface Feature {
  id: string
  title: string
  description: string
  icon: string
  link: string
  color: string
}

interface Stat {
  id: string
  label: string
  value: string | number
  trend: string
}

const FEATURES: Feature[] = [
  {
    id: 'dashboard',
    title: 'Dashboard',
    description: 'View key metrics, recent activity, and get an overview of your application data.',
    icon: '📊',
    link: '/dashboard',
    color: '#667eea',
  },
  {
    id: 'posts',
    title: 'Posts',
    description: 'Browse posts with pagination or infinite scroll. Seamlessly switch between views.',
    icon: '📝',
    link: '/posts',
    color: '#f093fb',
  },
  {
    id: 'profile',
    title: 'Profile',
    description: 'Manage your user profile, view stats, and update your account information.',
    icon: '👤',
    link: '/profile',
    color: '#4facfe',
  },
  {
    id: 'settings',
    title: 'Settings',
    description: 'Customize your preferences, manage notifications, and configure your experience.',
    icon: '⚙️',
    link: '/settings',
    color: '#43e97b',
  },
]

const TECH_STACK = [
  'React 18',
  'TypeScript',
  'Vite',
  'React Query',
  'Zustand',
  'React Router',
  'Axios',
  'ESLint',
] as const

function Home() {
  const count = useCounterStore((state) => state.count)
  const statsRef = useScrollAnimation()
  const featuresRef = useScrollAnimation()
  const techRef = useScrollAnimation()

  const stats = useMemo<Stat[]>(
    () => [
      { id: 'users', label: 'Total Users', value: '1,234', trend: '+12%' },
      { id: 'posts', label: 'Active Posts', value: '100', trend: '+8%' },
      { id: 'counter', label: 'Counter Value', value: count, trend: '0%' },
      { id: 'uptime', label: 'Uptime', value: '99.9%', trend: '+0.1%' },
    ],
    [count]
  )

  return (
    <div className="home-page">
      <HeroSection />
      <StatsSection ref={statsRef} stats={stats} />
      <FeaturesSection ref={featuresRef} features={FEATURES} />
      <TechSection ref={techRef} technologies={TECH_STACK} />
    </div>
  )
}

function HeroSection() {
  return (
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
  )
}

interface StatsSectionProps {
  stats: Stat[]
}

const StatsSection = forwardRef<HTMLDivElement, StatsSectionProps>(
  ({ stats }, ref) => {
    return (
      <section ref={ref} className="stats-section fade-up">
        <div className="stats-grid">
          {stats.map((stat) => (
            <StatCard key={stat.id} stat={stat} />
          ))}
        </div>
      </section>
    )
  }
)

StatsSection.displayName = 'StatsSection'

interface StatCardProps {
  stat: Stat
}

function StatCard({ stat }: StatCardProps) {
  return (
    <div className="stat-card">
      <div className="stat-value">{stat.value}</div>
      <div className="stat-label">{stat.label}</div>
      <div className="stat-trend">{stat.trend}</div>
    </div>
  )
}

interface FeaturesSectionProps {
  features: Feature[]
}

const FeaturesSection = forwardRef<HTMLDivElement, FeaturesSectionProps>(
  ({ features }, ref) => {
    return (
      <section ref={ref} className="features-section fade-up">
        <h2 className="section-title">Explore Features</h2>
        <p className="section-subtitle">
          Discover the powerful features built with modern web technologies
        </p>

        <div className="features-grid">
          {features.map((feature) => (
            <FeatureCard key={feature.id} feature={feature} />
          ))}
        </div>
      </section>
    )
  }
)

FeaturesSection.displayName = 'FeaturesSection'

interface FeatureCardProps {
  feature: Feature
}

function FeatureCard({ feature }: FeatureCardProps) {
  return (
    <Link
      to={feature.link}
      className="feature-card"
      style={{ '--accent-color': feature.color } as React.CSSProperties}
    >
      <div className="feature-icon" aria-hidden="true">
        {feature.icon}
      </div>
      <h3 className="feature-title">{feature.title}</h3>
      <p className="feature-description">{feature.description}</p>
      <div className="feature-arrow" aria-hidden="true">
        →
      </div>
    </Link>
  )
}

interface TechSectionProps {
  technologies: readonly string[]
}

const TechSection = forwardRef<HTMLDivElement, TechSectionProps>(
  ({ technologies }, ref) => {
    return (
      <section ref={ref} className="tech-section fade-up">
        <h2 className="section-title">Built With Modern Tech</h2>
        <div className="tech-grid">
          {technologies.map((tech) => (
            <div key={tech} className="tech-badge">
              {tech}
            </div>
          ))}
        </div>
      </section>
    )
  }
)

TechSection.displayName = 'TechSection'

export default Home
