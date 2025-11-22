/**
 * App-wide constants
 */

export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  MIN_PAGE_SIZE: 5,
  MAX_PAGE_SIZE: 100,
  DEFAULT_MAX_VISIBLE_PAGES: 5,
} as const

export const INFINITE_SCROLL = {
  DEFAULT_PAGE_SIZE: 10,
  ROOT_MARGIN: '100px',
  THRESHOLD: 0.1,
} as const

export const DEBOUNCE = {
  DEFAULT_DELAY: 300,
  SEARCH_DELAY: 500,
  INPUT_DELAY: 300,
} as const

export const BREAKPOINTS = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  '2XL': 1536,
} as const

