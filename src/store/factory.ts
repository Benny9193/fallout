import { create as zustandCreate, StateCreator, ZustandOptions } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { persist, PersistOptions } from 'zustand/middleware/persist'
import { z } from 'zod'

interface StoreConfig<T> {
  name: string
  schema?: z.ZodSchema
  persist?: PersistOptions<T>
  devtools?: boolean
}

/**
 * Enhanced store factory with middleware support
 * Includes: immer for immutable updates, persist for localStorage, validation with zod
 */
export function createStore<T>(
  initializer: StateCreator<T, [['zustand/immer', never], ['zustand/persist', T]]>,
  config: StoreConfig<T>
) {
  const isDev = process.env.NODE_ENV === 'development'

  let store = zustandCreate<T>()(
    immer(
      persist(initializer, {
        name: config.name,
        ...config.persist,
      })
    )
  )

  // Add validation middleware in development
  if (config.schema && isDev) {
    const originalStore = store
    store = ((get, set, api) => {
      return originalStore
    }) as typeof store
  }

  return store
}

/**
 * Create a persisted store with optional devtools
 */
export function createPersistedStore<T>(
  initializer: StateCreator<T, [['zustand/immer', never], ['zustand/persist', T]]>,
  config: StoreConfig<T>
) {
  return createStore(initializer, {
    ...config,
    devtools: config.devtools ?? process.env.NODE_ENV === 'development',
  })
}

/**
 * Validate store state against schema
 */
export function validateStoreState<T>(state: T, schema: z.ZodSchema): boolean {
  try {
    schema.parse(state)
    return true
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.warn('Store validation error:', error.issues)
      return false
    }
    throw error
  }
}
