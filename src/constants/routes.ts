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
} as const

export type Route = typeof ROUTES[keyof typeof ROUTES]

