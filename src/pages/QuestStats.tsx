import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { questService } from '../api/services'
import { Loading, ErrorDisplay, EmptyState } from '../components'
import { ROUTES } from '../constants'
import { useQuestProgressStore } from '../store/questProgressStore'
import type { QuestType } from '../types/api'
import './QuestStats.css'

function QuestStats() {
  // Fetch all quests
  const { data: quests, isLoading, error } = useQuery({
    queryKey: ['quests'],
    queryFn: questService.getQuests,
  })

  // Get quest progress from store
  const questProgress = useQuestProgressStore((state) => state.questProgress)
  const getCompletedQuestsCount = useQuestProgressStore((state) => state.getCompletedQuestsCount)
  const getInProgressQuestsCount = useQuestProgressStore((state) => state.getInProgressQuestsCount)
  const getFailedQuestsCount = useQuestProgressStore((state) => state.getFailedQuestsCount)
  const getTotalXP = useQuestProgressStore((state) => state.getTotalXP)
  const getTotalCaps = useQuestProgressStore((state) => state.getTotalCaps)
  const totalRewards = useQuestProgressStore((state) => state.totalRewards)
  const getRecentActivity = useQuestProgressStore((state) => state.getRecentActivity)
  const getTimeline = useQuestProgressStore((state) => state.getTimeline)

  // Calculate statistics
  const stats = useMemo(() => {
    const total = quests?.length || 0
    const completed = getCompletedQuestsCount()
    const inProgress = getInProgressQuestsCount()
    const failed = getFailedQuestsCount()
    const notStarted = total - completed - inProgress - failed

    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0

    return {
      total,
      completed,
      inProgress,
      failed,
      notStarted,
      completionRate,
    }
  }, [quests, getCompletedQuestsCount, getInProgressQuestsCount, getFailedQuestsCount])

  // Calculate quest type breakdown
  const typeBreakdown = useMemo(() => {
    if (!quests) return []

    const breakdown: Record<QuestType, { total: number; completed: number }> = {
      Main: { total: 0, completed: 0 },
      Side: { total: 0, completed: 0 },
      Faction: { total: 0, completed: 0 },
      Companion: { total: 0, completed: 0 },
      DLC: { total: 0, completed: 0 },
    }

    quests.forEach((quest) => {
      breakdown[quest.type].total++
      const progress = questProgress[quest.id]
      if (progress?.status === 'Completed') {
        breakdown[quest.type].completed++
      }
    })

    return Object.entries(breakdown).map(([type, data]) => ({
      type: type as QuestType,
      total: data.total,
      completed: data.completed,
      percentage: data.total > 0 ? Math.round((data.completed / data.total) * 100) : 0,
    }))
  }, [quests, questProgress])

  // Get recent activity
  const recentActivity = useMemo(() => getRecentActivity(20), [getRecentActivity])

  // Get timeline event icon
  const getEventIcon = (type: string) => {
    const iconMap: { [key: string]: string } = {
      started: '🎬',
      objective_completed: '✅',
      completed: '🏆',
      failed: '❌',
      note_added: '📝',
    }
    return iconMap[type] || '📌'
  }

  // Get timeline event color
  const getEventColor = (type: string) => {
    const colorMap: { [key: string]: string } = {
      started: 'event-started',
      objective_completed: 'event-objective',
      completed: 'event-completed',
      failed: 'event-failed',
      note_added: 'event-note',
    }
    return colorMap[type] || 'event-default'
  }

  // Format relative time
  const formatRelativeTime = (timestamp: string) => {
    const now = new Date()
    const then = new Date(timestamp)
    const diffMs = now.getTime() - then.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`
    return then.toLocaleDateString()
  }

  if (isLoading) {
    return (
      <div className="page quest-stats-page">
        <h1>Quest Statistics</h1>
        <Loading message="Loading quest statistics..." />
      </div>
    )
  }

  if (error) {
    return (
      <div className="page quest-stats-page">
        <h1>Quest Statistics</h1>
        <ErrorDisplay
          error={error}
          title="Failed to load quest statistics"
          onRetry={() => window.location.reload()}
        />
      </div>
    )
  }

  return (
    <div className="page quest-stats-page">
      {/* Header */}
      <div className="stats-header">
        <div>
          <h1>Quest Statistics</h1>
          <p>Track your progress, rewards, and quest history</p>
        </div>
        <Link to={ROUTES.QUESTS} className="btn-secondary">
          View All Quests
        </Link>
      </div>

      {/* Overview Stats */}
      <div className="stats-overview">
        <div className="stat-card stat-total">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <div className="stat-value">{stats.total}</div>
            <div className="stat-label">Total Quests</div>
          </div>
        </div>
        <div className="stat-card stat-completed">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <div className="stat-value">{stats.completed}</div>
            <div className="stat-label">Completed</div>
          </div>
        </div>
        <div className="stat-card stat-in-progress">
          <div className="stat-icon">🎯</div>
          <div className="stat-content">
            <div className="stat-value">{stats.inProgress}</div>
            <div className="stat-label">In Progress</div>
          </div>
        </div>
        <div className="stat-card stat-failed">
          <div className="stat-icon">❌</div>
          <div className="stat-content">
            <div className="stat-value">{stats.failed}</div>
            <div className="stat-label">Failed</div>
          </div>
        </div>
        <div className="stat-card stat-completion">
          <div className="stat-icon">📈</div>
          <div className="stat-content">
            <div className="stat-value">{stats.completionRate}%</div>
            <div className="stat-label">Completion Rate</div>
          </div>
        </div>
      </div>

      <div className="stats-content">
        {/* Left Column: Charts & Quest Types */}
        <div className="stats-column stats-left">
          {/* Completion Progress */}
          <div className="stats-section">
            <h2>Overall Progress</h2>
            <div className="progress-chart">
              <div className="chart-bar">
                <div
                  className="chart-segment segment-completed"
                  style={{ width: `${(stats.completed / stats.total) * 100}%` }}
                  title={`Completed: ${stats.completed}`}
                />
                <div
                  className="chart-segment segment-in-progress"
                  style={{ width: `${(stats.inProgress / stats.total) * 100}%` }}
                  title={`In Progress: ${stats.inProgress}`}
                />
                <div
                  className="chart-segment segment-failed"
                  style={{ width: `${(stats.failed / stats.total) * 100}%` }}
                  title={`Failed: ${stats.failed}`}
                />
                <div
                  className="chart-segment segment-not-started"
                  style={{ width: `${(stats.notStarted / stats.total) * 100}%` }}
                  title={`Not Started: ${stats.notStarted}`}
                />
              </div>
              <div className="chart-legend">
                <div className="legend-item">
                  <span className="legend-color legend-completed" />
                  <span>Completed ({stats.completed})</span>
                </div>
                <div className="legend-item">
                  <span className="legend-color legend-in-progress" />
                  <span>In Progress ({stats.inProgress})</span>
                </div>
                <div className="legend-item">
                  <span className="legend-color legend-failed" />
                  <span>Failed ({stats.failed})</span>
                </div>
                <div className="legend-item">
                  <span className="legend-color legend-not-started" />
                  <span>Not Started ({stats.notStarted})</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quest Type Breakdown */}
          <div className="stats-section">
            <h2>Quest Types</h2>
            <div className="type-breakdown">
              {typeBreakdown.map((item) => (
                <div key={item.type} className="type-item">
                  <div className="type-header">
                    <span className="type-name">{item.type}</span>
                    <span className="type-stats">
                      {item.completed} / {item.total}
                    </span>
                  </div>
                  <div className="type-progress">
                    <div className="progress-bar">
                      <div
                        className="progress-fill"
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                    <span className="type-percentage">{item.percentage}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Rewards Tracker */}
          <div className="stats-section rewards-section">
            <h2>Rewards Collected</h2>
            <div className="rewards-grid">
              <div className="reward-stat">
                <div className="reward-icon">⭐</div>
                <div className="reward-content">
                  <div className="reward-value">{getTotalXP().toLocaleString()}</div>
                  <div className="reward-label">Experience Points</div>
                </div>
              </div>
              <div className="reward-stat">
                <div className="reward-icon">💰</div>
                <div className="reward-content">
                  <div className="reward-value">{getTotalCaps().toLocaleString()}</div>
                  <div className="reward-label">Caps</div>
                </div>
              </div>
              <div className="reward-stat">
                <div className="reward-icon">📦</div>
                <div className="reward-content">
                  <div className="reward-value">{totalRewards.items.length}</div>
                  <div className="reward-label">Unique Items</div>
                </div>
              </div>
              <div className="reward-stat">
                <div className="reward-icon">🎯</div>
                <div className="reward-content">
                  <div className="reward-value">{totalRewards.perks.length}</div>
                  <div className="reward-label">Perks</div>
                </div>
              </div>
            </div>

            {/* Item & Perk Lists */}
            {(totalRewards.items.length > 0 || totalRewards.perks.length > 0) && (
              <div className="reward-details">
                {totalRewards.items.length > 0 && (
                  <div className="reward-list">
                    <h3>Items Collected</h3>
                    <ul>
                      {totalRewards.items.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {totalRewards.perks.length > 0 && (
                  <div className="reward-list">
                    <h3>Perks Earned</h3>
                    <ul>
                      {totalRewards.perks.map((perk, index) => (
                        <li key={index}>{perk}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Timeline */}
        <div className="stats-column stats-right">
          <div className="stats-section timeline-section">
            <h2>Recent Activity</h2>
            {recentActivity.length === 0 ? (
              <EmptyState
                title="No activity yet"
                message="Start completing quests to see your activity timeline"
              />
            ) : (
              <div className="timeline">
                {recentActivity.map((event) => (
                  <div key={event.id} className={`timeline-event ${getEventColor(event.type)}`}>
                    <div className="event-icon">{getEventIcon(event.type)}</div>
                    <div className="event-content">
                      <div className="event-description">{event.description}</div>
                      <div className="event-time">{formatRelativeTime(event.timestamp)}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {recentActivity.length > 0 && getTimeline().length > recentActivity.length && (
              <div className="timeline-footer">
                <p>Showing {recentActivity.length} of {getTimeline().length} total events</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default QuestStats
