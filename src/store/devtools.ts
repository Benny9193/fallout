/**
 * Zustand DevTools Configuration
 *
 * Enable state inspection and time-travel debugging in development mode.
 * Install the Redux DevTools browser extension to use this feature:
 * https://github.com/reduxjs/redux-devtools-extension
 */

const isDevelopment = import.meta.env.MODE === 'development'

export const devtoolsConfig = {
  enabled: isDevelopment,
  trace: true,
  traceLimit: 25,
}

/**
 * Custom action tracker for stores
 * Helps identify which actions triggered state changes
 */
export interface StoreAction {
  name: string
  timestamp: number
  payload?: unknown
}

/**
 * Create a tracked action for devtools
 */
export function createAction(name: string, payload?: unknown): StoreAction {
  return {
    name,
    timestamp: Date.now(),
    payload,
  }
}

/**
 * Log action in development mode
 */
export function logAction(action: StoreAction) {
  if (isDevelopment) {
    console.debug(`[Store] ${action.name}`, action.payload)
  }
}
