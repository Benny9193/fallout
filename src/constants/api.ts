/**
 * API configuration constants
 */

export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || 'https://jsonplaceholder.typicode.com',
  TIMEOUT: 10000,
  DEFAULT_HEADERS: {
    'Content-Type': 'application/json',
  },
} as const

export const API_ENDPOINTS = {
  USERS: '/users',
  POSTS: '/posts',
} as const

export const STORAGE_KEYS = {
  AUTH_TOKEN: 'authToken',
  THEME: 'theme',
} as const

