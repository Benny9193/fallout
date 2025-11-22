import { useQuery } from '@tanstack/react-query'
import { useCounterStore } from '../store/counterStore'
import { dashboardService } from '../api/services'
import './Dashboard.css'

function Dashboard() {
  const count = useCounterStore((state) => state.count)

  // Fetch metrics from API
  const { data: metrics, isLoading: metricsLoading, error: metricsError } = useQuery({
    queryKey: ['metrics'],
    queryFn: dashboardService.getMetrics,
  })

  // Fetch activity from API
  const { data: activities, isLoading: activityLoading, error: activityError } = useQuery({
    queryKey: ['activity'],
    queryFn: dashboardService.getActivity,
  })

  // Add counter value to metrics if data is loaded
  const displayMetrics = metrics ? [
    ...metrics.slice(0, 2),
    { label: 'Counter Value', value: count, change: '0%', positive: true },
    ...metrics.slice(2),
  ] : []

  return (
    <div className="page dashboard-page">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <p>Overview of your application metrics and activity</p>
      </div>

      <div className="dashboard-grid">
        <div className="metrics-section">
          <h2>Key Metrics</h2>
          {metricsLoading ? (
            <div className="loading">Loading metrics...</div>
          ) : metricsError ? (
            <div className="error">Error loading metrics: {(metricsError as Error).message}</div>
          ) : (
            <div className="metrics-grid">
              {displayMetrics.map((metric, index) => (
                <div key={index} className="metric-card">
                  <div className="metric-label">{metric.label}</div>
                  <div className="metric-value">{metric.value}</div>
                  <div className={`metric-change ${metric.positive ? 'positive' : 'negative'}`}>
                    {metric.change}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="activity-section">
          <h2>Recent Activity</h2>
          {activityLoading ? (
            <div className="loading">Loading activity...</div>
          ) : activityError ? (
            <div className="error">Error loading activity: {(activityError as Error).message}</div>
          ) : (
            <div className="activity-list">
              {activities?.map((activity) => (
                <div key={activity.id} className="activity-item">
                  <div className="activity-icon">
                    <span>•</span>
                  </div>
                  <div className="activity-content">
                    <div className="activity-text">{activity.text}</div>
                    <div className="activity-time">{activity.time}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="quick-actions">
          <h2>Quick Actions</h2>
          <div className="actions-grid">
            <button className="action-button">
              <span className="action-icon">📊</span>
              <span>View Reports</span>
            </button>
            <button className="action-button">
              <span className="action-icon">⚙️</span>
              <span>Settings</span>
            </button>
            <button className="action-button">
              <span className="action-icon">👤</span>
              <span>Profile</span>
            </button>
            <button className="action-button">
              <span className="action-icon">🏠</span>
              <span>Home</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
