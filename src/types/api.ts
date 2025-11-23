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

