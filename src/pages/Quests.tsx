import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { questService } from '../api/services'
import { Loading, ErrorDisplay, EmptyState } from '../components'
import { ROUTES } from '../constants'
import { useQuestProgressStore } from '../store/questProgressStore'
import type { QuestType, QuestStatus, QuestDifficulty, Quest } from '../types/api'
import './Quests.css'

function Quests() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedType, setSelectedType] = useState<QuestType | 'All'>('All')
  const [selectedStatus, setSelectedStatus] = useState<QuestStatus | 'All'>('All')
  const [selectedDifficulty, setSelectedDifficulty] = useState<QuestDifficulty | 'All'>('All')

  // Fetch quests
  const { data: quests, isLoading, error } = useQuery({
    queryKey: ['quests'],
    queryFn: questService.getQuests,
  })

  // Get quest progress from store
  const questProgress = useQuestProgressStore((state) => state.questProgress)
  const getQuestProgress = useQuestProgressStore((state) => state.getQuestProgress)

  // Merge quests with progress data
  const questsWithProgress = useMemo(() => {
    if (!quests) return []

    return quests.map((quest) => {
      const progress = getQuestProgress(quest.id)
      return {
        ...quest,
        status: progress?.status || quest.status,
        objectives: quest.objectives.map((obj) => ({
          ...obj,
          completed: progress?.completedObjectives.includes(obj.id) || obj.completed,
        })),
      }
    })
  }, [quests, questProgress, getQuestProgress])

  // Filter quests based on search, type, status, and difficulty
  const filteredQuests = useMemo(() => {
    if (!questsWithProgress) return []

    let result = questsWithProgress

    // Filter by type
    if (selectedType !== 'All') {
      result = result.filter((quest) => quest.type === selectedType)
    }

    // Filter by status
    if (selectedStatus !== 'All') {
      result = result.filter((quest) => quest.status === selectedStatus)
    }

    // Filter by difficulty
    if (selectedDifficulty !== 'All') {
      result = result.filter((quest) => quest.difficulty === selectedDifficulty)
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (quest) =>
          quest.title.toLowerCase().includes(query) ||
          quest.description.toLowerCase().includes(query) ||
          quest.location.toLowerCase().includes(query) ||
          quest.giver.toLowerCase().includes(query),
      )
    }

    return result
  }, [questsWithProgress, searchQuery, selectedType, selectedStatus, selectedDifficulty])

  // Get quest type badge color
  const getTypeBadgeClass = (type: QuestType) => {
    const typeMap = {
      Main: 'badge-main',
      Side: 'badge-side',
      Faction: 'badge-faction',
      Companion: 'badge-companion',
      DLC: 'badge-dlc',
    }
    return typeMap[type] || 'badge-default'
  }

  // Get quest status badge color
  const getStatusBadgeClass = (status: QuestStatus) => {
    const statusMap = {
      'Not Started': 'badge-not-started',
      'In Progress': 'badge-in-progress',
      Completed: 'badge-completed',
      Failed: 'badge-failed',
    }
    return statusMap[status] || 'badge-default'
  }

  // Get difficulty badge color
  const getDifficultyBadgeClass = (difficulty: QuestDifficulty) => {
    const difficultyMap = {
      Easy: 'badge-easy',
      Medium: 'badge-medium',
      Hard: 'badge-hard',
      'Very Hard': 'badge-very-hard',
    }
    return difficultyMap[difficulty] || 'badge-default'
  }

  if (isLoading) {
    return (
      <div className="page quests-page">
        <h1>Quests</h1>
        <Loading message="Loading quests..." />
      </div>
    )
  }

  if (error) {
    return (
      <div className="page quests-page">
        <h1>Quests</h1>
        <ErrorDisplay
          error={error}
          title="Failed to load quests"
          onRetry={() => window.location.reload()}
        />
      </div>
    )
  }

  return (
    <div className="page quests-page">
      <div className="quests-header">
        <div className="quests-title">
          <h1>Quests</h1>
          <p>Main storylines, side missions, and faction quests</p>
        </div>
        <div className="quests-stats">
          <div className="stat">
            <span className="stat-label">Total</span>
            <span className="stat-value">{quests?.length || 0}</span>
          </div>
          <div className="stat">
            <span className="stat-label">Active</span>
            <span className="stat-value">
              {questsWithProgress?.filter((q) => q.status === 'In Progress').length || 0}
            </span>
          </div>
          <div className="stat">
            <span className="stat-label">Completed</span>
            <span className="stat-value">
              {questsWithProgress?.filter((q) => q.status === 'Completed').length || 0}
            </span>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="quests-search">
        <input
          type="text"
          placeholder="Search quests by title, location, or quest giver..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
        {searchQuery && (
          <button
            className="search-clear"
            onClick={() => setSearchQuery('')}
            aria-label="Clear search"
          >
            ✕
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="quests-filters">
        <div className="filter-group">
          <label htmlFor="type-filter">Type:</label>
          <select
            id="type-filter"
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value as QuestType | 'All')}
            className="filter-select"
          >
            <option value="All">All Types</option>
            <option value="Main">Main Quests</option>
            <option value="Side">Side Quests</option>
            <option value="Faction">Faction Quests</option>
            <option value="Companion">Companion Quests</option>
            <option value="DLC">DLC Quests</option>
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="status-filter">Status:</label>
          <select
            id="status-filter"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value as QuestStatus | 'All')}
            className="filter-select"
          >
            <option value="All">All Statuses</option>
            <option value="Not Started">Not Started</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
            <option value="Failed">Failed</option>
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="difficulty-filter">Difficulty:</label>
          <select
            id="difficulty-filter"
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value as QuestDifficulty | 'All')}
            className="filter-select"
          >
            <option value="All">All Difficulties</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
            <option value="Very Hard">Very Hard</option>
          </select>
        </div>
      </div>

      {/* Active Filters Display */}
      {(selectedType !== 'All' || selectedStatus !== 'All' || selectedDifficulty !== 'All' || searchQuery) && (
        <div className="active-filters">
          <span className="filter-label">Active filters:</span>
          {searchQuery && (
            <span className="filter-tag">
              Search: "{searchQuery}"
              <button onClick={() => setSearchQuery('')}>✕</button>
            </span>
          )}
          {selectedType !== 'All' && (
            <span className="filter-tag">
              Type: {selectedType}
              <button onClick={() => setSelectedType('All')}>✕</button>
            </span>
          )}
          {selectedStatus !== 'All' && (
            <span className="filter-tag">
              Status: {selectedStatus}
              <button onClick={() => setSelectedStatus('All')}>✕</button>
            </span>
          )}
          {selectedDifficulty !== 'All' && (
            <span className="filter-tag">
              Difficulty: {selectedDifficulty}
              <button onClick={() => setSelectedDifficulty('All')}>✕</button>
            </span>
          )}
          <button
            className="clear-all-filters"
            onClick={() => {
              setSearchQuery('')
              setSelectedType('All')
              setSelectedStatus('All')
              setSelectedDifficulty('All')
            }}
          >
            Clear All
          </button>
        </div>
      )}

      {/* Quest List */}
      <div className="quests-list">
        {filteredQuests.length === 0 ? (
          <EmptyState
            title="No quests found"
            message="Try adjusting your filters or search query"
            action={
              <button
                onClick={() => {
                  setSearchQuery('')
                  setSelectedType('All')
                  setSelectedStatus('All')
                  setSelectedDifficulty('All')
                }}
                className="btn-primary"
              >
                Clear Filters
              </button>
            }
          />
        ) : (
          filteredQuests.map((quest) => (
            <Link
              key={quest.id}
              to={ROUTES.QUEST_DETAIL.replace(':id', quest.id.toString())}
              className="quest-card"
            >
              <div className="quest-card-header">
                <h3 className="quest-title">{quest.title}</h3>
                <div className="quest-badges">
                  <span className={`badge ${getTypeBadgeClass(quest.type)}`}>
                    {quest.type}
                  </span>
                  <span className={`badge ${getStatusBadgeClass(quest.status)}`}>
                    {quest.status}
                  </span>
                  <span className={`badge ${getDifficultyBadgeClass(quest.difficulty)}`}>
                    {quest.difficulty}
                  </span>
                </div>
              </div>

              <p className="quest-description">{quest.description}</p>

              <div className="quest-meta">
                <div className="quest-meta-item">
                  <span className="meta-icon">📍</span>
                  <span className="meta-text">{quest.location}</span>
                </div>
                <div className="quest-meta-item">
                  <span className="meta-icon">👤</span>
                  <span className="meta-text">{quest.giver}</span>
                </div>
                <div className="quest-meta-item">
                  <span className="meta-icon">⭐</span>
                  <span className="meta-text">Level {quest.level}</span>
                </div>
                {quest.faction && (
                  <div className="quest-meta-item">
                    <span className="meta-icon">🏛️</span>
                    <span className="meta-text">{quest.faction}</span>
                  </div>
                )}
              </div>

              <div className="quest-progress">
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{
                      width: `${(quest.objectives.filter((o) => o.completed).length / quest.objectives.length) * 100}%`,
                    }}
                  />
                </div>
                <span className="progress-text">
                  {quest.objectives.filter((o) => o.completed).length} / {quest.objectives.length} objectives
                </span>
              </div>
            </Link>
          ))
        )}
      </div>

      {filteredQuests.length > 0 && (
        <div className="quests-footer">
          <p>Showing {filteredQuests.length} of {quests?.length || 0} quests</p>
        </div>
      )}
    </div>
  )
}

export default Quests
