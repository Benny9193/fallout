import { useMemo, forwardRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { useCounterStore } from '../store/counterStore'
import { dashboardService, type Metric, type Activity } from '../api/services'
import { useScrollAnimation } from '../hooks/useScrollAnimation'
import { Loading, ErrorDisplay, EmptyState } from '../components'
import { ROUTES } from '../constants/routes'
import './Dashboard.css'

interface QuickAction {
  id: string
  label: string
  icon: string
  path: string
  ariaLabel: string
}

const QUICK_ACTIONS: QuickAction[] = [
  {
    id: 'reports',
    label: 'View Reports',
    icon: '📊',
    path: ROUTES.DASHBOARD,
    ariaLabel: 'View reports and analytics',
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: '⚙️',
    path: ROUTES.SETTINGS,
    ariaLabel: 'Go to settings page',
  },
  {
    id: 'profile',
    label: 'Profile',
    icon: '👤',
    path: ROUTES.PROFILE,
    ariaLabel: 'Go to profile page',
  },
  {
    id: 'home',
    label: 'Home',
    icon: '🏠',
    path: ROUTES.HOME,
    ariaLabel: 'Go to home page',
  },
] as const

interface DisplayMetric extends Metric {
  id: string
}

function Dashboard() {
  const count = useCounterStore((state) => state.count)
  const metricsRef = useScrollAnimation()
  const activityRef = useScrollAnimation()
  const actionsRef = useScrollAnimation()

  // Fetch metrics from API
  const {
    data: metrics,
    isLoading: metricsLoading,
    error: metricsError,
    refetch: refetchMetrics,
  } = useQuery({
    queryKey: ['metrics'],
    queryFn: dashboardService.getMetrics,
  })

  // Fetch activity from API
  const {
    data: activities,
    isLoading: activityLoading,
    error: activityError,
    refetch: refetchActivity,
  } = useQuery({
    queryKey: ['activity'],
    queryFn: dashboardService.getActivity,
  })

  // Add counter value to metrics if data is loaded
  const displayMetrics = useMemo<DisplayMetric[]>(() => {
    if (!metrics) return []

    const counterMetric: DisplayMetric = {
      id: 'counter',
      label: 'Counter Value',
      value: count,
      change: '0%',
      positive: true,
    }

    return [
      ...metrics.slice(0, 2).map((m, i) => ({ ...m, id: `metric-${i}` })),
      counterMetric,
      ...metrics.slice(2).map((m, i) => ({ ...m, id: `metric-${i + 3}` })),
    ]
  }, [metrics, count])

  return (
    <div className="page dashboard-page">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <p>Overview of your application metrics and activity</p>
      </div>

      <div className="dashboard-grid">
        <MetricsSection
          ref={metricsRef}
          metrics={displayMetrics}
          isLoading={metricsLoading}
          error={metricsError}
          onRetry={() => refetchMetrics()}
        />
        <ActivitySection
          ref={activityRef}
          activities={activities}
          isLoading={activityLoading}
          error={activityError}
          onRetry={() => refetchActivity()}
        />
        <QuickActionsSection ref={actionsRef} actions={QUICK_ACTIONS} />
      </div>
    </div>
  )
}

interface MetricsSectionProps {
  metrics: DisplayMetric[]
  isLoading: boolean
  error: Error | null
  onRetry: () => void
}

const MetricsSection = forwardRef<HTMLDivElement, MetricsSectionProps>(
  ({ metrics, isLoading, error, onRetry }, ref) => {
    return (
      <section ref={ref} className="metrics-section fade-up">
        <h2>Key Metrics</h2>
        {isLoading ? (
          <Loading message="Loading metrics..." />
        ) : error ? (
          <ErrorDisplay
            error={error}
            title="Failed to load metrics"
            onRetry={onRetry}
          />
        ) : (
          <div className="metrics-grid" role="region" aria-label="Key metrics">
            {metrics.map((metric) => (
              <MetricCard key={metric.id} metric={metric} />
            ))}
          </div>
        )}
      </section>
    )
  }
)

MetricsSection.displayName = 'MetricsSection'

interface MetricCardProps {
  metric: DisplayMetric
}

function MetricCard({ metric }: MetricCardProps) {
  return (
    <div className="metric-card">
      <div className="metric-label">{metric.label}</div>
      <div className="metric-value" aria-label={`${metric.label}: ${metric.value}`}>
        {metric.value}
      </div>
      <div
        className={`metric-change ${metric.positive ? 'positive' : 'negative'}`}
        aria-label={`Change: ${metric.change}`}
      >
        {metric.change}
      </div>
    </div>
  )
}

interface ActivitySectionProps {
  activities: Activity[] | undefined
  isLoading: boolean
  error: Error | null
  onRetry: () => void
}

const ActivitySection = forwardRef<HTMLDivElement, ActivitySectionProps>(
  ({ activities, isLoading, error, onRetry }, ref) => {
    return (
      <section ref={ref} className="activity-section fade-up">
        <h2>Recent Activity</h2>
        {isLoading ? (
          <Loading message="Loading activity..." />
        ) : error ? (
          <ErrorDisplay
            error={error}
            title="Failed to load activity"
            onRetry={onRetry}
          />
        ) : (
          <div className="activity-list" role="region" aria-label="Recent activity">
            {activities && activities.length > 0 ? (
              activities.map((activity) => (
                <ActivityItem key={activity.id} activity={activity} />
              ))
            ) : (
              <EmptyState
                title="No recent activity"
                message="There is no recent activity to display."
                icon="📋"
              />
            )}
          </div>
        )}
      </section>
    )
  }
)

ActivitySection.displayName = 'ActivitySection'

interface ActivityItemProps {
  activity: Activity
}

function ActivityItem({ activity }: ActivityItemProps) {
  return (
    <div className="activity-item">
      <div className="activity-icon" aria-hidden="true">
        <span>•</span>
      </div>
      <div className="activity-content">
        <div className="activity-text">{activity.text}</div>
        <div className="activity-time" aria-label={`Time: ${activity.time}`}>
          {activity.time}
        </div>
      </div>
    </div>
  )
}

interface QuickActionsSectionProps {
  actions: readonly QuickAction[]
}

const QuickActionsSection = forwardRef<HTMLDivElement, QuickActionsSectionProps>(
  ({ actions }, ref) => {
    const navigate = useNavigate()

    const handleActionClick = (path: string) => {
      navigate(path)
    }

    return (
      <section ref={ref} className="quick-actions fade-up">
        <h2>Quick Actions</h2>
        <div className="actions-grid" role="region" aria-label="Quick actions">
          {actions.map((action) => (
            <button
              key={action.id}
              className="action-button"
              onClick={() => handleActionClick(action.path)}
              aria-label={action.ariaLabel}
              type="button"
            >
              <span className="action-icon" aria-hidden="true">
                {action.icon}
              </span>
              <span>{action.label}</span>
            </button>
          ))}
        </div>
      </section>
    )
  }
)

QuickActionsSection.displayName = 'QuickActionsSection'

export default Dashboard
