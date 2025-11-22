import { z } from 'zod'

interface StoreConfig {
  name: string
  schema?: z.ZodSchema
}

/**
 * Validate store state against schema
 * Useful for validating persisted state on rehydration
 */
export function validateStoreState<T>(state: unknown, schema: z.ZodSchema): state is T {
  try {
    schema.parse(state)
    return true
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.warn(`Store validation error for ${schema}:`, error.issues)
      return false
    }
    throw error
  }
}

/**
 * Safe parse for store state
 * Returns validated state or null if invalid
 */
export function safeParseStoreState<T>(state: unknown, schema: z.ZodSchema): T | null {
  try {
    return schema.parse(state) as T
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.warn('Store validation failed:', error.issues)
      return null
    }
    throw error
  }
}
