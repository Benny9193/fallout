import { useMemo } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { questService } from '../api/services'
import { Loading, ErrorDisplay } from '../components'
import { ROUTES } from '../constants'
import type { QuestType, QuestStatus, QuestDifficulty } from '../types/api'
import './QuestDetail.css'

function QuestDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const questId = id ? parseInt(id, 10) : 0

  // Fetch the quest
  const { data: quest, isLoading, error } = useQuery({
    queryKey: ['quest', questId],
    queryFn: () => questService.getQuest(questId),
  })

  // Fetch all quests for related quests
  const { data: allQuests } = useQuery({
    queryKey: ['quests'],
    queryFn: questService.getQuests,
  })

  // Find related quests
  const relatedQuestsData = useMemo(() => {
    if (!quest || !allQuests || !quest.relatedQuests) return []
    return allQuests.filter((q) => quest.relatedQuests?.includes(q.id))
  }, [quest, allQuests])

  // Get badge classes
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

  const getStatusBadgeClass = (status: QuestStatus) => {
    const statusMap = {
      'Not Started': 'badge-not-started',
      'In Progress': 'badge-in-progress',
      Completed: 'badge-completed',
      Failed: 'badge-failed',
    }
    return statusMap[status] || 'badge-default'
  }

  const getDifficultyBadgeClass = (difficulty: QuestDifficulty) => {
    const difficultyMap = {
      Easy: 'badge-easy',
      Medium: 'badge-medium',
      Hard: 'badge-hard',
      'Very Hard': 'badge-very-hard',
    }
    return difficultyMap[difficulty] || 'badge-default'
  }

  const getRewardIcon = (type: string) => {
    const iconMap: { [key: string]: string } = {
      Caps: '💰',
      XP: '⭐',
      Item: '📦',
      Perk: '🎯',
      Reputation: '🏛️',
    }
    return iconMap[type] || '🎁'
  }

  if (isLoading) {
    return (
      <div className="page quest-detail-page">
        <Loading message="Loading quest..." />
      </div>
    )
  }

  if (error || !quest) {
    return (
      <div className="page quest-detail-page">
        <ErrorDisplay
          error={error || new Error('Quest not found')}
          title="Failed to load quest"
          onRetry={() => navigate(ROUTES.QUESTS)}
        />
        <div className="quest-back">
          <Link to={ROUTES.QUESTS} className="back-link">
            ← Back to Quests
          </Link>
        </div>
      </div>
    )
  }

  const completedObjectives = quest.objectives.filter((o) => o.completed).length
  const progressPercentage = (completedObjectives / quest.objectives.length) * 100

  return (
    <div className="page quest-detail-page">
      {/* Back Button */}
      <div className="quest-back">
        <Link to={ROUTES.QUESTS} className="back-link">
          ← Back to Quests
        </Link>
      </div>

      {/* Quest Header */}
      <div className="quest-header">
        <div className="quest-header-content">
          <h1 className="quest-title">{quest.title}</h1>
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
      </div>

      {/* Quest Info Grid */}
      <div className="quest-info-grid">
        <div className="info-card">
          <span className="info-icon">📍</span>
          <div className="info-content">
            <span className="info-label">Location</span>
            <span className="info-value">{quest.location}</span>
          </div>
        </div>
        <div className="info-card">
          <span className="info-icon">👤</span>
          <div className="info-content">
            <span className="info-label">Quest Giver</span>
            <span className="info-value">{quest.giver}</span>
          </div>
        </div>
        <div className="info-card">
          <span className="info-icon">⭐</span>
          <div className="info-content">
            <span className="info-label">Recommended Level</span>
            <span className="info-value">Level {quest.level}</span>
          </div>
        </div>
        {quest.faction && (
          <div className="info-card">
            <span className="info-icon">🏛️</span>
            <div className="info-content">
              <span className="info-label">Faction</span>
              <span className="info-value">{quest.faction}</span>
            </div>
          </div>
        )}
      </div>

      {/* Quest Progress */}
      <div className="quest-section quest-progress-section">
        <h2>Progress</h2>
        <div className="progress-container">
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          <span className="progress-percentage">{Math.round(progressPercentage)}%</span>
        </div>
        <p className="progress-text">
          {completedObjectives} of {quest.objectives.length} objectives completed
        </p>
      </div>

      {/* Objectives */}
      <div className="quest-section objectives-section">
        <h2>Objectives</h2>
        <ul className="objectives-list">
          {quest.objectives.map((objective) => (
            <li
              key={objective.id}
              className={`objective-item ${objective.completed ? 'completed' : ''} ${objective.optional ? 'optional' : ''}`}
            >
              <span className="objective-checkbox">
                {objective.completed ? '✓' : objective.optional ? '◯' : '○'}
              </span>
              <span className="objective-text">
                {objective.description}
                {objective.optional && <span className="optional-tag">(Optional)</span>}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* Rewards */}
      <div className="quest-section rewards-section">
        <h2>Rewards</h2>
        <div className="rewards-grid">
          {quest.rewards.map((reward, index) => (
            <div key={index} className="reward-card">
              <span className="reward-icon">{getRewardIcon(reward.type)}</span>
              <div className="reward-content">
                <span className="reward-type">{reward.type}</span>
                <span className="reward-value">{reward.value}</span>
                {reward.description && (
                  <span className="reward-description">{reward.description}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Walkthrough */}
      <div className="quest-section walkthrough-section">
        <h2>Walkthrough</h2>
        <div
          className="walkthrough-content"
          dangerouslySetInnerHTML={{
            __html: quest.walkthrough
              .split('\n\n')
              .map((paragraph) => {
                // Check if it's a heading
                if (paragraph.startsWith('##')) {
                  return `<h3>${paragraph.replace(/^##\s*/, '')}</h3>`
                }
                // Check if it's a list
                if (paragraph.startsWith('- ')) {
                  const items = paragraph
                    .split('\n')
                    .filter((line) => line.startsWith('- '))
                    .map((line) => `<li>${line.replace(/^-\s*/, '')}</li>`)
                    .join('')
                  return `<ul>${items}</ul>`
                }
                // Check if it's a numbered list
                if (/^\d+\./.test(paragraph)) {
                  const items = paragraph
                    .split('\n')
                    .filter((line) => /^\d+\./.test(line))
                    .map((line) => `<li>${line.replace(/^\d+\.\s*/, '')}</li>`)
                    .join('')
                  return `<ol>${items}</ol>`
                }
                // Regular paragraph
                return `<p>${paragraph}</p>`
              })
              .join(''),
          }}
        />
      </div>

      {/* Choices and Consequences */}
      {(quest.choices || quest.consequences) && (
        <div className="quest-section choices-section">
          {quest.choices && (
            <>
              <h2>Choices</h2>
              <ul className="choices-list">
                {quest.choices.map((choice, index) => (
                  <li key={index} className="choice-item">
                    {choice}
                  </li>
                ))}
              </ul>
            </>
          )}
          {quest.consequences && (
            <>
              <h3>Consequences</h3>
              <div className="consequences-box">
                <p>{quest.consequences}</p>
              </div>
            </>
          )}
        </div>
      )}

      {/* Related Quests */}
      {relatedQuestsData.length > 0 && (
        <div className="quest-section related-quests-section">
          <h2>Related Quests</h2>
          <div className="related-quests-grid">
            {relatedQuestsData.map((relatedQuest) => (
              <Link
                key={relatedQuest.id}
                to={ROUTES.QUEST_DETAIL.replace(':id', relatedQuest.id.toString())}
                className="related-quest-card"
              >
                <h3 className="related-quest-title">{relatedQuest.title}</h3>
                <div className="related-quest-badges">
                  <span className={`badge ${getTypeBadgeClass(relatedQuest.type)}`}>
                    {relatedQuest.type}
                  </span>
                  <span className={`badge ${getStatusBadgeClass(relatedQuest.status)}`}>
                    {relatedQuest.status}
                  </span>
                </div>
                <p className="related-quest-description">{relatedQuest.description}</p>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Quest Metadata */}
      <div className="quest-metadata">
        <div className="metadata-item">
          <span className="metadata-label">Created:</span>
          <span className="metadata-value">
            {new Date(quest.createdAt).toLocaleDateString()}
          </span>
        </div>
        <div className="metadata-item">
          <span className="metadata-label">Last Updated:</span>
          <span className="metadata-value">
            {new Date(quest.updatedAt).toLocaleDateString()}
          </span>
        </div>
      </div>
    </div>
  )
}

export default QuestDetail
