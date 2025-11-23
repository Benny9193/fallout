/**
 * Route path constants
 */

export const ROUTES = {
  HOME: '/',
  DASHBOARD: '/dashboard',
  POSTS: '/posts',
  POSTS_INFINITE: '/posts/infinite',
  PROFILE: '/profile',
  SETTINGS: '/settings',
  ABOUT: '/about',
  COMPENDIUM: '/compendium',
  COMPENDIUM_ARTICLE: '/compendium/:id',
  QUESTS: '/quests',
  QUEST_DETAIL: '/quests/:id',
  QUEST_STATS: '/quests/stats',
} as const

export type Route = typeof ROUTES[keyof typeof ROUTES]

