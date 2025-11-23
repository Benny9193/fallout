import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { persist } from 'zustand/middleware'
import type { QuestStatus, QuestReward } from '../types/api'

// Timeline event tracking
export interface TimelineEvent {
  id: string
  questId: number
  questTitle?: string
  type: 'started' | 'objective_completed' | 'completed' | 'failed' | 'note_added'
  description: string
  timestamp: string
}

// Collected reward tracking
export interface CollectedReward {
  questId: number
  questTitle: string
  reward: QuestReward
  collectedAt: string
}

// Note attachment tracking
export interface NoteAttachment {
  id: string
  name: string
  type: string // MIME type (e.g., 'image/png')
  data: string // Base64 encoded data
  size: number // Size in bytes
  uploadedAt: string
}

// Quest progress tracking
interface QuestProgress {
  questId: number
  status: QuestStatus
  completedObjectives: number[] // IDs of completed objectives
  notes: string
  attachments?: NoteAttachment[] // Image/file attachments for notes
  startedAt?: string
  completedAt?: string
  failedAt?: string
  timeSpent?: number // Time in seconds
  collectedRewards: QuestReward[] // Rewards collected from this quest
}

interface QuestProgressState {
  questProgress: Record<number, QuestProgress>
  timeline: TimelineEvent[]
  totalRewards: {
    xp: number
    caps: number
    items: string[]
    perks: string[]
  }

  // Actions
  startQuest: (questId: number, questTitle?: string) => void
  completeQuest: (questId: number, questTitle?: string) => void
  failQuest: (questId: number, questTitle?: string) => void
  updateQuestStatus: (questId: number, status: QuestStatus) => void
  toggleObjective: (questId: number, objectiveId: number, description?: string) => void
  setQuestNote: (questId: number, note: string) => void
  collectReward: (questId: number, questTitle: string, reward: QuestReward) => void
  resetQuest: (questId: number) => void
  resetAllProgress: () => void

  // Note attachments
  addNoteAttachment: (questId: number, attachment: Omit<NoteAttachment, 'id' | 'uploadedAt'>) => void
  removeNoteAttachment: (questId: number, attachmentId: string) => void

  // Export/Import
  exportAllProgress: () => string
  importProgress: (data: string, merge?: boolean) => boolean

  // Getters
  getQuestProgress: (questId: number) => QuestProgress | undefined
  isObjectiveCompleted: (questId: number, objectiveId: number) => boolean
  getCompletedQuestsCount: () => number
  getInProgressQuestsCount: () => number
  getFailedQuestsCount: () => number
  getTotalXP: () => number
  getTotalCaps: () => number
  getTimeline: () => TimelineEvent[]
  getRecentActivity: (limit?: number) => TimelineEvent[]
  getCollectedRewards: () => CollectedReward[]
}

const defaultProgress: Partial<QuestProgress> = {
  status: 'Not Started',
  completedObjectives: [],
  notes: '',
  collectedRewards: [],
  attachments: [],
}

// Helper to generate unique IDs
const generateId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

export const useQuestProgressStore = create<QuestProgressState>()(
  immer(
    persist(
      (set, get) => ({
        questProgress: {},
        timeline: [],
        totalRewards: {
          xp: 0,
          caps: 0,
          items: [],
          perks: [],
        },

        startQuest: (questId: number, questTitle?: string) => set((state) => {
          const timestamp = new Date().toISOString()

          if (!state.questProgress[questId]) {
            state.questProgress[questId] = {
              questId,
              status: 'In Progress',
              completedObjectives: [],
              notes: '',
              startedAt: timestamp,
              collectedRewards: [],
            }
          } else {
            state.questProgress[questId].status = 'In Progress'
            if (!state.questProgress[questId].startedAt) {
              state.questProgress[questId].startedAt = timestamp
            }
          }

          // Add timeline event
          state.timeline.unshift({
            id: generateId(),
            questId,
            questTitle,
            type: 'started',
            description: questTitle ? `Started "${questTitle}"` : `Started quest #${questId}`,
            timestamp,
          })
        }),

        completeQuest: (questId: number, questTitle?: string) => set((state) => {
          const timestamp = new Date().toISOString()

          if (!state.questProgress[questId]) {
            state.questProgress[questId] = {
              questId,
              status: 'Completed',
              completedObjectives: [],
              notes: '',
              startedAt: timestamp,
              completedAt: timestamp,
              collectedRewards: [],
            }
          } else {
            state.questProgress[questId].status = 'Completed'
            state.questProgress[questId].completedAt = timestamp
          }

          // Add timeline event
          state.timeline.unshift({
            id: generateId(),
            questId,
            questTitle,
            type: 'completed',
            description: questTitle ? `Completed "${questTitle}"` : `Completed quest #${questId}`,
            timestamp,
          })
        }),

        failQuest: (questId: number, questTitle?: string) => set((state) => {
          const timestamp = new Date().toISOString()

          if (!state.questProgress[questId]) {
            state.questProgress[questId] = {
              questId,
              status: 'Failed',
              completedObjectives: [],
              notes: '',
              failedAt: timestamp,
              collectedRewards: [],
            }
          } else {
            state.questProgress[questId].status = 'Failed'
            state.questProgress[questId].failedAt = timestamp
          }

          // Add timeline event
          state.timeline.unshift({
            id: generateId(),
            questId,
            questTitle,
            type: 'failed',
            description: questTitle ? `Failed "${questTitle}"` : `Failed quest #${questId}`,
            timestamp,
          })
        }),

        updateQuestStatus: (questId: number, status: QuestStatus) => set((state) => {
          const timestamp = new Date().toISOString()

          if (!state.questProgress[questId]) {
            state.questProgress[questId] = {
              questId,
              status,
              completedObjectives: [],
              notes: '',
              collectedRewards: [],
            }
          } else {
            state.questProgress[questId].status = status
          }

          // Update timestamps
          if (status === 'In Progress' && !state.questProgress[questId].startedAt) {
            state.questProgress[questId].startedAt = timestamp
          }
          if (status === 'Completed' && !state.questProgress[questId].completedAt) {
            state.questProgress[questId].completedAt = timestamp
          }
          if (status === 'Failed' && !state.questProgress[questId].failedAt) {
            state.questProgress[questId].failedAt = timestamp
          }
        }),

        toggleObjective: (questId: number, objectiveId: number, description?: string) => set((state) => {
          const timestamp = new Date().toISOString()

          if (!state.questProgress[questId]) {
            state.questProgress[questId] = {
              questId,
              status: 'In Progress',
              completedObjectives: [objectiveId],
              notes: '',
              startedAt: timestamp,
              collectedRewards: [],
            }

            // Add timeline event for starting quest
            state.timeline.unshift({
              id: generateId(),
              questId,
              type: 'started',
              description: `Started quest #${questId}`,
              timestamp,
            })
          } else {
            const objectives = state.questProgress[questId].completedObjectives
            const index = objectives.indexOf(objectiveId)

            if (index > -1) {
              // Remove if already completed
              objectives.splice(index, 1)
            } else {
              // Add if not completed
              objectives.push(objectiveId)

              // Add timeline event for objective completion
              state.timeline.unshift({
                id: generateId(),
                questId,
                type: 'objective_completed',
                description: description || `Completed objective #${objectiveId}`,
                timestamp,
              })
            }

            // Auto-start quest if not started
            if (state.questProgress[questId].status === 'Not Started') {
              state.questProgress[questId].status = 'In Progress'
              state.questProgress[questId].startedAt = timestamp
            }
          }
        }),

        setQuestNote: (questId: number, note: string) => set((state) => {
          const timestamp = new Date().toISOString()

          if (!state.questProgress[questId]) {
            state.questProgress[questId] = {
              questId,
              status: 'Not Started',
              completedObjectives: [],
              notes: note,
              collectedRewards: [],
            }
          } else {
            const oldNote = state.questProgress[questId].notes
            state.questProgress[questId].notes = note

            // Only add timeline event if note is not empty and changed
            if (note && note !== oldNote) {
              state.timeline.unshift({
                id: generateId(),
                questId,
                type: 'note_added',
                description: `Added note to quest #${questId}`,
                timestamp,
              })
            }
          }
        }),

        collectReward: (questId: number, questTitle: string, reward: QuestReward) => set((state) => {
          if (!state.questProgress[questId]) {
            state.questProgress[questId] = {
              questId,
              status: 'Not Started',
              completedObjectives: [],
              notes: '',
              collectedRewards: [reward],
            }
          } else {
            // Add reward to quest progress if not already collected
            const alreadyCollected = state.questProgress[questId].collectedRewards.some(
              r => r.type === reward.type && r.value === reward.value
            )

            if (!alreadyCollected) {
              state.questProgress[questId].collectedRewards.push(reward)

              // Update total rewards
              if (reward.type === 'XP') {
                state.totalRewards.xp += parseInt(reward.value) || 0
              } else if (reward.type === 'Caps') {
                state.totalRewards.caps += parseInt(reward.value) || 0
              } else if (reward.type === 'Item' && !state.totalRewards.items.includes(reward.value)) {
                state.totalRewards.items.push(reward.value)
              } else if (reward.type === 'Perk' && !state.totalRewards.perks.includes(reward.value)) {
                state.totalRewards.perks.push(reward.value)
              }
            }
          }
        }),

        resetQuest: (questId: number) => set((state) => {
          delete state.questProgress[questId]
          // Remove timeline events for this quest
          state.timeline = state.timeline.filter(event => event.questId !== questId)
        }),

        resetAllProgress: () => set((state) => {
          state.questProgress = {}
          state.timeline = []
          state.totalRewards = {
            xp: 0,
            caps: 0,
            items: [],
            perks: [],
          }
        }),

        // Getters
        getQuestProgress: (questId: number) => {
          return get().questProgress[questId]
        },

        isObjectiveCompleted: (questId: number, objectiveId: number) => {
          const progress = get().questProgress[questId]
          return progress?.completedObjectives.includes(objectiveId) ?? false
        },

        getCompletedQuestsCount: () => {
          const progress = get().questProgress
          return Object.values(progress).filter(p => p.status === 'Completed').length
        },

        getInProgressQuestsCount: () => {
          const progress = get().questProgress
          return Object.values(progress).filter(p => p.status === 'In Progress').length
        },

        getFailedQuestsCount: () => {
          const progress = get().questProgress
          return Object.values(progress).filter(p => p.status === 'Failed').length
        },

        getTotalXP: () => {
          return get().totalRewards.xp
        },

        getTotalCaps: () => {
          return get().totalRewards.caps
        },

        getTimeline: () => {
          return get().timeline
        },

        getRecentActivity: (limit = 10) => {
          return get().timeline.slice(0, limit)
        },

        getCollectedRewards: () => {
          const progress = get().questProgress
          const rewards: CollectedReward[] = []

          Object.values(progress).forEach((quest) => {
            quest.collectedRewards.forEach((reward) => {
              rewards.push({
                questId: quest.questId,
                questTitle: `Quest #${quest.questId}`,
                reward,
                collectedAt: quest.completedAt || new Date().toISOString(),
              })
            })
          })

          return rewards.sort((a, b) =>
            new Date(b.collectedAt).getTime() - new Date(a.collectedAt).getTime()
          )
        },

        // Note attachments
        addNoteAttachment: (questId: number, attachment: Omit<NoteAttachment, 'id' | 'uploadedAt'>) => set((state) => {
          const timestamp = new Date().toISOString()

          if (!state.questProgress[questId]) {
            state.questProgress[questId] = {
              questId,
              status: 'Not Started',
              completedObjectives: [],
              notes: '',
              collectedRewards: [],
              attachments: [],
            }
          }

          if (!state.questProgress[questId].attachments) {
            state.questProgress[questId].attachments = []
          }

          state.questProgress[questId].attachments!.push({
            ...attachment,
            id: generateId(),
            uploadedAt: timestamp,
          })
        }),

        removeNoteAttachment: (questId: number, attachmentId: string) => set((state) => {
          if (state.questProgress[questId]?.attachments) {
            state.questProgress[questId].attachments = state.questProgress[questId].attachments!.filter(
              (att) => att.id !== attachmentId
            )
          }
        }),

        // Export/Import
        exportAllProgress: () => {
          const state = get()
          const exportData = {
            version: 2,
            exportedAt: new Date().toISOString(),
            questProgress: state.questProgress,
            timeline: state.timeline,
            totalRewards: state.totalRewards,
          }
          return JSON.stringify(exportData, null, 2)
        },

        importProgress: (data: string, merge = false) => {
          try {
            const importData = JSON.parse(data)

            // Validate import data
            if (!importData.version || !importData.questProgress) {
              console.error('Invalid import data format')
              return false
            }

            set((state) => {
              if (merge) {
                // Merge imported data with existing data
                Object.entries(importData.questProgress).forEach(([questId, progress]) => {
                  state.questProgress[Number(questId)] = progress as QuestProgress
                })

                // Merge timeline (remove duplicates by id)
                const existingIds = new Set(state.timeline.map((e) => e.id))
                const newEvents = (importData.timeline || []).filter(
                  (e: TimelineEvent) => !existingIds.has(e.id)
                )
                state.timeline.push(...newEvents)
                state.timeline.sort((a, b) =>
                  new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
                )

                // Merge total rewards
                if (importData.totalRewards) {
                  state.totalRewards.xp += importData.totalRewards.xp || 0
                  state.totalRewards.caps += importData.totalRewards.caps || 0

                  // Merge items and perks (remove duplicates)
                  const newItems = importData.totalRewards.items || []
                  newItems.forEach((item: string) => {
                    if (!state.totalRewards.items.includes(item)) {
                      state.totalRewards.items.push(item)
                    }
                  })

                  const newPerks = importData.totalRewards.perks || []
                  newPerks.forEach((perk: string) => {
                    if (!state.totalRewards.perks.includes(perk)) {
                      state.totalRewards.perks.push(perk)
                    }
                  })
                }
              } else {
                // Replace all data
                state.questProgress = importData.questProgress
                state.timeline = importData.timeline || []
                state.totalRewards = importData.totalRewards || {
                  xp: 0,
                  caps: 0,
                  items: [],
                  perks: [],
                }
              }
            })

            return true
          } catch (error) {
            console.error('Failed to import progress:', error)
            return false
          }
        },
      }),
      {
        name: 'quest-progress-store',
        version: 3,
      }
    )
  )
)
