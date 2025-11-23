/**
 * API-related types
 */

export interface User {
  id: number
  name: string
  email: string
  username: string
  phone: string
  website: string
}

export interface Post {
  id: number
  userId: number
  title: string
  body: string
}

export interface Activity {
  id: number
  text: string
  time: string
}

export interface Metric {
  label: string
  value: string | number
  change: string
  positive: boolean
}

export interface PostsPage {
  posts: Post[]
  nextPage: number | undefined
  hasMore: boolean
}

export interface ApiError {
  message: string
  status?: number
  code?: string
}

export interface CompendiumArticle {
  id: number
  title: string
  category: string
  description: string
  content: string
  createdAt: string
  updatedAt: string
  readTime: number // minutes
  views: number
}

export interface CompendiumCategory {
  id: string
  name: string
  description: string
  count: number
}

export type QuestType = 'Main' | 'Side' | 'Faction' | 'Companion' | 'DLC'
export type QuestStatus = 'Not Started' | 'In Progress' | 'Completed' | 'Failed'
export type QuestDifficulty = 'Easy' | 'Medium' | 'Hard' | 'Very Hard'

export interface QuestObjective {
  id: number
  description: string
  completed: boolean
  optional: boolean
}

export interface QuestReward {
  type: 'Caps' | 'XP' | 'Item' | 'Perk' | 'Reputation'
  value: string
  description?: string
}

export interface Quest {
  id: number
  title: string
  type: QuestType
  status: QuestStatus
  difficulty: QuestDifficulty
  description: string
  location: string
  giver: string
  level: number
  objectives: QuestObjective[]
  rewards: QuestReward[]
  walkthrough: string
  choices?: string[]
  consequences?: string
  relatedQuests?: number[]
  faction?: string
  createdAt: string
  updatedAt: string
}

