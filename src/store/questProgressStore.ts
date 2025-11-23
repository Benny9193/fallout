import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { persist } from 'zustand/middleware'
import type { QuestStatus } from '../types/api'

// Quest progress tracking
interface QuestProgress {
  questId: number
  status: QuestStatus
  completedObjectives: number[] // IDs of completed objectives
  notes: string
  startedAt?: string
  completedAt?: string
}

interface QuestProgressState {
  questProgress: Record<number, QuestProgress>

  // Actions
  startQuest: (questId: number) => void
  completeQuest: (questId: number) => void
  failQuest: (questId: number) => void
  updateQuestStatus: (questId: number, status: QuestStatus) => void
  toggleObjective: (questId: number, objectiveId: number) => void
  setQuestNote: (questId: number, note: string) => void
  resetQuest: (questId: number) => void
  resetAllProgress: () => void

  // Getters
  getQuestProgress: (questId: number) => QuestProgress | undefined
  isObjectiveCompleted: (questId: number, objectiveId: number) => boolean
  getCompletedQuestsCount: () => number
  getInProgressQuestsCount: () => number
}

const defaultProgress: Partial<QuestProgress> = {
  status: 'Not Started',
  completedObjectives: [],
  notes: '',
}

export const useQuestProgressStore = create<QuestProgressState>()(
  immer(
    persist(
      (set, get) => ({
        questProgress: {},

        startQuest: (questId: number) => set((state) => {
          if (!state.questProgress[questId]) {
            state.questProgress[questId] = {
              questId,
              status: 'In Progress',
              completedObjectives: [],
              notes: '',
              startedAt: new Date().toISOString(),
            }
          } else {
            state.questProgress[questId].status = 'In Progress'
            if (!state.questProgress[questId].startedAt) {
              state.questProgress[questId].startedAt = new Date().toISOString()
            }
          }
        }),

        completeQuest: (questId: number) => set((state) => {
          if (!state.questProgress[questId]) {
            state.questProgress[questId] = {
              questId,
              status: 'Completed',
              completedObjectives: [],
              notes: '',
              startedAt: new Date().toISOString(),
              completedAt: new Date().toISOString(),
            }
          } else {
            state.questProgress[questId].status = 'Completed'
            state.questProgress[questId].completedAt = new Date().toISOString()
          }
        }),

        failQuest: (questId: number) => set((state) => {
          if (!state.questProgress[questId]) {
            state.questProgress[questId] = {
              questId,
              status: 'Failed',
              completedObjectives: [],
              notes: '',
            }
          } else {
            state.questProgress[questId].status = 'Failed'
          }
        }),

        updateQuestStatus: (questId: number, status: QuestStatus) => set((state) => {
          if (!state.questProgress[questId]) {
            state.questProgress[questId] = {
              questId,
              status,
              completedObjectives: [],
              notes: '',
            }
          } else {
            state.questProgress[questId].status = status
          }

          // Update timestamps
          if (status === 'In Progress' && !state.questProgress[questId].startedAt) {
            state.questProgress[questId].startedAt = new Date().toISOString()
          }
          if (status === 'Completed' && !state.questProgress[questId].completedAt) {
            state.questProgress[questId].completedAt = new Date().toISOString()
          }
        }),

        toggleObjective: (questId: number, objectiveId: number) => set((state) => {
          if (!state.questProgress[questId]) {
            state.questProgress[questId] = {
              questId,
              status: 'In Progress',
              completedObjectives: [objectiveId],
              notes: '',
              startedAt: new Date().toISOString(),
            }
          } else {
            const objectives = state.questProgress[questId].completedObjectives
            const index = objectives.indexOf(objectiveId)

            if (index > -1) {
              // Remove if already completed
              objectives.splice(index, 1)
            } else {
              // Add if not completed
              objectives.push(objectiveId)
            }

            // Auto-start quest if not started
            if (state.questProgress[questId].status === 'Not Started') {
              state.questProgress[questId].status = 'In Progress'
              state.questProgress[questId].startedAt = new Date().toISOString()
            }
          }
        }),

        setQuestNote: (questId: number, note: string) => set((state) => {
          if (!state.questProgress[questId]) {
            state.questProgress[questId] = {
              questId,
              status: 'Not Started',
              completedObjectives: [],
              notes: note,
            }
          } else {
            state.questProgress[questId].notes = note
          }
        }),

        resetQuest: (questId: number) => set((state) => {
          delete state.questProgress[questId]
        }),

        resetAllProgress: () => set((state) => {
          state.questProgress = {}
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
      }),
      {
        name: 'quest-progress-store',
        version: 1,
      }
    )
  )
)
