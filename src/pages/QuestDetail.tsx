import { useMemo, useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { questService } from '../api/services'
import { Loading, ErrorDisplay, MarkdownEditor, QuestProgressManager } from '../components'
import { ROUTES } from '../constants'
import { useQuestProgressStore } from '../store/questProgressStore'
import type { QuestType, QuestStatus, QuestDifficulty } from '../types/api'
import './QuestDetail.css'

function QuestDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const questId = id ? parseInt(id, 10) : 0

  // Quest progress store
  const getQuestProgress = useQuestProgressStore((state) => state.getQuestProgress)
  const startQuest = useQuestProgressStore((state) => state.startQuest)
  const completeQuest = useQuestProgressStore((state) => state.completeQuest)
  const failQuest = useQuestProgressStore((state) => state.failQuest)
  const updateQuestStatus = useQuestProgressStore((state) => state.updateQuestStatus)
  const toggleObjective = useQuestProgressStore((state) => state.toggleObjective)
  const isObjectiveCompleted = useQuestProgressStore((state) => state.isObjectiveCompleted)
  const setQuestNote = useQuestProgressStore((state) => state.setQuestNote)
  const addNoteAttachment = useQuestProgressStore((state) => state.addNoteAttachment)
  const removeNoteAttachment = useQuestProgressStore((state) => state.removeNoteAttachment)
  const exportAllProgress = useQuestProgressStore((state) => state.exportAllProgress)

  // Local state for notes
  const [noteText, setNoteText] = useState('')
  const [isEditingNote, setIsEditingNote] = useState(false)
  const [showProgressManager, setShowProgressManager] = useState(false)

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

  // Get quest progress
  const questProgress = getQuestProgress(questId)

  // Merge quest with progress data
  const questWithProgress = useMemo(() => {
    if (!quest) return null

    return {
      ...quest,
      status: questProgress?.status || quest.status,
      objectives: quest.objectives.map((obj) => ({
        ...obj,
        completed: questProgress?.completedObjectives.includes(obj.id) || obj.completed,
      })),
    }
  }, [quest, questProgress])

  // Initialize note text when quest progress loads
  useMemo(() => {
    if (questProgress?.notes) {
      setNoteText(questProgress.notes)
    }
  }, [questProgress?.notes])

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

  // Handle note save
  const handleSaveNote = () => {
    setQuestNote(questId, noteText)
    setIsEditingNote(false)
  }

  // Handle image upload
  const handleImageUpload = (file: File) => {
    const reader = new FileReader()
    reader.onload = () => {
      const base64 = reader.result as string
      addNoteAttachment(questId, {
        name: file.name,
        type: file.type,
        data: base64,
        size: file.size,
      })
    }
    reader.readAsDataURL(file)
  }

  // Share quest notes
  const handleShareNotes = () => {
    if (!questProgress?.notes && (!questProgress?.attachments || questProgress.attachments.length === 0)) {
      alert('No notes to share')
      return
    }

    const shareText = `## ${questWithProgress.title}\n\n${questProgress?.notes || 'No notes'}`
    navigator.clipboard.writeText(shareText).then(() => {
      alert('Notes copied to clipboard!')
    })
  }

  // Export this quest
  const handleExportQuest = () => {
    const questData = {
      quest: {
        id: quest!.id,
        title: quest!.title,
        type: quest!.type,
        difficulty: quest!.difficulty,
      },
      progress: questProgress,
    }
    const blob = new Blob([JSON.stringify(questData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `quest-${questId}-${quest!.title.replace(/\s+/g, '-').toLowerCase()}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  if (error || !questWithProgress) {
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

  const completedObjectives = questWithProgress.objectives.filter((o) => o.completed).length
  const progressPercentage = (completedObjectives / questWithProgress.objectives.length) * 100

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
          <h1 className="quest-title">{questWithProgress.title}</h1>
          <div className="quest-badges">
            <span className={`badge ${getTypeBadgeClass(questWithProgress.type)}`}>
              {questWithProgress.type}
            </span>
            <span className={`badge ${getStatusBadgeClass(questWithProgress.status)}`}>
              {questWithProgress.status}
            </span>
            <span className={`badge ${getDifficultyBadgeClass(questWithProgress.difficulty)}`}>
              {questWithProgress.difficulty}
            </span>
          </div>
        </div>
        <p className="quest-description">{questWithProgress.description}</p>

        {/* Quest Action Buttons */}
        <div className="quest-actions">
          {questWithProgress.status === 'Not Started' && (
            <button
              onClick={() => startQuest(questId, questWithProgress.title)}
              className="btn-primary"
            >
              Start Quest
            </button>
          )}
          {questWithProgress.status === 'In Progress' && (
            <>
              <button
                onClick={() => completeQuest(questId, questWithProgress.title)}
                className="btn-success"
              >
                Mark Complete
              </button>
              <button
                onClick={() => failQuest(questId, questWithProgress.title)}
                className="btn-danger"
              >
                Mark Failed
              </button>
            </>
          )}
          {(questWithProgress.status === 'Completed' || questWithProgress.status === 'Failed') && (
            <button
              onClick={() => updateQuestStatus(questId, 'Not Started')}
              className="btn-secondary"
            >
              Reset Quest
            </button>
          )}
          <button
            onClick={() => setShowProgressManager(true)}
            className="btn-secondary"
            title="Export or Import quest progress"
          >
            📊 Manage Progress
          </button>
        </div>
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
            <span className="info-value">Level {questWithProgress.level}</span>
          </div>
        </div>
        {questWithProgress.faction && (
          <div className="info-card">
            <span className="info-icon">🏛️</span>
            <div className="info-content">
              <span className="info-label">Faction</span>
              <span className="info-value">{questWithProgress.faction}</span>
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
          {completedObjectives} of {questWithProgress.objectives.length} objectives completed
        </p>
      </div>

      {/* Objectives */}
      <div className="quest-section objectives-section">
        <h2>Objectives</h2>
        <p className="objectives-hint">Click on objectives to mark them as complete</p>
        <ul className="objectives-list">
          {questWithProgress.objectives.map((objective) => (
            <li
              key={objective.id}
              className={`objective-item ${objective.completed ? 'completed' : ''} ${objective.optional ? 'optional' : ''} interactive`}
              onClick={() => toggleObjective(questId, objective.id, objective.description)}
              role="button"
              tabIndex={0}
              onKeyPress={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  toggleObjective(questId, objective.id, objective.description)
                }
              }}
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

      {/* Quest Notes */}
      <div className="quest-section notes-section">
        <div className="notes-header">
          <h2>Quest Notes & Strategy</h2>
          <div className="notes-header-actions">
            {!isEditingNote && (
              <>
                <button
                  onClick={() => setIsEditingNote(true)}
                  className="btn-secondary btn-small"
                >
                  {questProgress?.notes ? 'Edit Note' : 'Add Note'}
                </button>
                {(questProgress?.notes || questProgress?.attachments?.length) && (
                  <>
                    <button onClick={handleShareNotes} className="btn-secondary btn-small">
                      📋 Share
                    </button>
                    <button onClick={handleExportQuest} className="btn-secondary btn-small">
                      💾 Export
                    </button>
                  </>
                )}
              </>
            )}
          </div>
        </div>
        {isEditingNote ? (
          <div className="notes-editor">
            <MarkdownEditor
              value={noteText}
              onChange={setNoteText}
              placeholder="Write your quest notes and strategy in markdown..."
              onImageUpload={handleImageUpload}
              minRows={8}
            />
            <div className="notes-actions">
              <button onClick={handleSaveNote} className="btn-primary btn-small">
                💾 Save Note
              </button>
              <button
                onClick={() => {
                  setIsEditingNote(false)
                  setNoteText(questProgress?.notes || '')
                }}
                className="btn-secondary btn-small"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="notes-display">
              {questProgress?.notes ? (
                <div
                  className="note-text markdown-content"
                  dangerouslySetInnerHTML={{
                    __html: questProgress.notes
                      .replace(/&/g, '&amp;')
                      .replace(/</g, '&lt;')
                      .replace(/>/g, '&gt;')
                      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
                      .replace(/\*([^*]+)\*/g, '<em>$1</em>')
                      .replace(/`([^`]+)`/g, '<code>$1</code>')
                      .replace(/^## (.*$)/gim, '<h3>$1</h3>')
                      .replace(/\n/g, '<br>'),
                  }}
                />
              ) : (
                <p className="note-placeholder">
                  No notes yet. Click "Add Note" to add your personal notes and strategy for this quest.
                </p>
              )}
            </div>

            {/* Attachments Display */}
            {questProgress?.attachments && questProgress.attachments.length > 0 && (
              <div className="notes-attachments">
                <h4>Attachments ({questProgress.attachments.length})</h4>
                <div className="attachments-grid">
                  {questProgress.attachments.map((attachment) => (
                    <div key={attachment.id} className="attachment-card">
                      {attachment.type.startsWith('image/') ? (
                        <img
                          src={attachment.data}
                          alt={attachment.name}
                          className="attachment-image"
                        />
                      ) : (
                        <div className="attachment-file">
                          <span className="attachment-icon">📎</span>
                          <span className="attachment-name">{attachment.name}</span>
                        </div>
                      )}
                      <button
                        onClick={() => removeNoteAttachment(questId, attachment.id)}
                        className="attachment-remove"
                        title="Remove attachment"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Rewards */}
      <div className="quest-section rewards-section">
        <h2>Rewards</h2>
        <div className="rewards-grid">
          {questWithProgress.rewards.map((reward, index) => (
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
            __html: questWithProgress.walkthrough
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
      {(questWithProgress.choices || questWithProgress.consequences) && (
        <div className="quest-section choices-section">
          {questWithProgress.choices && (
            <>
              <h2>Choices</h2>
              <ul className="choices-list">
                {questWithProgress.choices.map((choice, index) => (
                  <li key={index} className="choice-item">
                    {choice}
                  </li>
                ))}
              </ul>
            </>
          )}
          {questWithProgress.consequences && (
            <>
              <h3>Consequences</h3>
              <div className="consequences-box">
                <p>{questWithProgress.consequences}</p>
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
            {new Date(questWithProgress.createdAt).toLocaleDateString()}
          </span>
        </div>
        <div className="metadata-item">
          <span className="metadata-label">Last Updated:</span>
          <span className="metadata-value">
            {new Date(questWithProgress.updatedAt).toLocaleDateString()}
          </span>
        </div>
        {questProgress?.startedAt && (
          <div className="metadata-item">
            <span className="metadata-label">Started:</span>
            <span className="metadata-value">
              {new Date(questProgress.startedAt).toLocaleDateString()}
            </span>
          </div>
        )}
        {questProgress?.completedAt && (
          <div className="metadata-item">
            <span className="metadata-label">Completed:</span>
            <span className="metadata-value">
              {new Date(questProgress.completedAt).toLocaleDateString()}
            </span>
          </div>
        )}
      </div>

      {/* Quest Progress Manager Modal */}
      {showProgressManager && (
        <QuestProgressManager onClose={() => setShowProgressManager(false)} />
      )}
    </div>
  )
}

export default QuestDetail
