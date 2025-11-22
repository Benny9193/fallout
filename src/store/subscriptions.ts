import { StoreApi, UseBoundStore } from 'zustand'

/**
 * Subscribe to specific state changes
 * Only triggers callback when the selected state changes
 */
export function subscribeToStateChange<T, S>(
  store: UseBoundStore<StoreApi<T>>,
  selector: (state: T) => S,
  callback: (state: S, prevState: S | undefined) => void
) {
  let prevState: S | undefined
  const unsubscribe = store.subscribe(
    (state) => selector(state),
    (newState: S) => {
      if (prevState !== newState) {
        callback(newState, prevState)
        prevState = newState
      }
    }
  )
  return unsubscribe
}

/**
 * Listen to store changes and log them (for debugging)
 */
export function debugStore<T>(
  store: UseBoundStore<StoreApi<T>>,
  label: string
) {
  return store.subscribe(
    (state) => state,
    (newState: T) => {
      console.debug(`[${label}]`, newState)
    }
  )
}

/**
 * Sync store state to external system (e.g., analytics)
 */
export function syncStoreToExternal<T, S>(
  store: UseBoundStore<StoreApi<T>>,
  selector: (state: T) => S,
  sync: (state: S) => void | Promise<void>
) {
  let prevState: S | undefined
  const unsubscribe = store.subscribe(
    (state) => selector(state),
    (newState: S) => {
      if (prevState !== newState) {
        void sync(newState)
        prevState = newState
      }
    }
  )
  return unsubscribe
}

/**
 * Create a computed selector that recomputes when dependencies change
 */
export function createSelector<T, S>(
  store: UseBoundStore<StoreApi<T>>,
  compute: (state: T) => S
): () => S {
  return () => compute(store.getState())
}

/**
 * Batch multiple store updates
 */
export async function batchStoreUpdates<T>(
  store: UseBoundStore<StoreApi<T>>,
  updates: Array<(state: T) => void>
): Promise<void> {
  store.setState((state) => {
    updates.forEach((update) => update(state))
    return state
  })
}
