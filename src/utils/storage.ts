/**
 * Type-safe localStorage and sessionStorage utilities
 */

/**
 * Get an item from localStorage with type safety
 */
export function getLocalStorageItem<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') {
    return defaultValue
  }

  try {
    const item = localStorage.getItem(key)
    if (item === null) {
      return defaultValue
    }
    return JSON.parse(item) as T
  } catch (error) {
    console.error(`Error reading localStorage key "${key}":`, error)
    return defaultValue
  }
}

/**
 * Set an item in localStorage with type safety
 */
export function setLocalStorageItem<T>(key: string, value: T): boolean {
  if (typeof window === 'undefined') {
    return false
  }

  try {
    localStorage.setItem(key, JSON.stringify(value))
    return true
  } catch (error) {
    console.error(`Error setting localStorage key "${key}":`, error)
    return false
  }
}

/**
 * Remove an item from localStorage
 */
export function removeLocalStorageItem(key: string): boolean {
  if (typeof window === 'undefined') {
    return false
  }

  try {
    localStorage.removeItem(key)
    return true
  } catch (error) {
    console.error(`Error removing localStorage key "${key}":`, error)
    return false
  }
}

/**
 * Clear all items from localStorage
 */
export function clearLocalStorage(): boolean {
  if (typeof window === 'undefined') {
    return false
  }

  try {
    localStorage.clear()
    return true
  } catch (error) {
    console.error('Error clearing localStorage:', error)
    return false
  }
}

/**
 * Get an item from sessionStorage with type safety
 */
export function getSessionStorageItem<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') {
    return defaultValue
  }

  try {
    const item = sessionStorage.getItem(key)
    if (item === null) {
      return defaultValue
    }
    return JSON.parse(item) as T
  } catch (error) {
    console.error(`Error reading sessionStorage key "${key}":`, error)
    return defaultValue
  }
}

/**
 * Set an item in sessionStorage with type safety
 */
export function setSessionStorageItem<T>(key: string, value: T): boolean {
  if (typeof window === 'undefined') {
    return false
  }

  try {
    sessionStorage.setItem(key, JSON.stringify(value))
    return true
  } catch (error) {
    console.error(`Error setting sessionStorage key "${key}":`, error)
    return false
  }
}

/**
 * Remove an item from sessionStorage
 */
export function removeSessionStorageItem(key: string): boolean {
  if (typeof window === 'undefined') {
    return false
  }

  try {
    sessionStorage.removeItem(key)
    return true
  } catch (error) {
    console.error(`Error removing sessionStorage key "${key}":`, error)
    return false
  }
}

/**
 * Clear all items from sessionStorage
 */
export function clearSessionStorage(): boolean {
  if (typeof window === 'undefined') {
    return false
  }

  try {
    sessionStorage.clear()
    return true
  } catch (error) {
    console.error('Error clearing sessionStorage:', error)
    return false
  }
}

