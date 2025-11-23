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

export interface Character {
  id: number
  name: string
  faction: string
  role: string
  game: string
  description: string
  imageUrl?: string
  status: 'Alive' | 'Deceased' | 'Unknown'
  type: 'Protagonist' | 'Companion' | 'Antagonist' | 'NPC' | 'Faction Leader'
}

export type NPCRole = 'Companion' | 'Merchant' | 'Quest Giver' | 'Faction Leader' | 'Civilian' | 'Enemy'
export type NPCFaction = 'Brotherhood of Steel' | 'Railroad' | 'Institute' | 'Minutemen' | 'Raiders' | 'Gunners' | 'Children of Atom' | 'None'
export type NPCLocation = 'Commonwealth' | 'Capital Wasteland' | 'Mojave Wasteland' | 'Appalachia' | 'Various'

export interface NPCPerk {
  name: string
  description: string
  requirement?: string
}

export interface NPCStats {
  health: number
  level: number
  resistance?: {
    damage: number
    energy: number
    radiation: number
  }
}

export interface NPC {
  id: number
  name: string
  role: NPCRole
  faction: NPCFaction
  location: NPCLocation
  description: string
  biography: string
  image?: string
  isCompanion: boolean
  isMerchant: boolean
  isEssential: boolean
  perks?: NPCPerk[]
  stats?: NPCStats
  inventory?: string[]
  quests?: string[]
  dialogue?: string[]
  relationships?: {
    likes: string[]
    dislikes: string[]
  }
  createdAt: string
  updatedAt: string
}

