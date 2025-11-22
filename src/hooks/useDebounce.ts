import { useEffect, useState } from 'react'
import { DEBOUNCE } from '../constants/app'

interface UseDebounceOptions {
  delay?: number
}

/**
 * Debounce a value - returns the value after the specified delay has passed
 * without any updates to the value
 */
export function useDebounce<T>(value: T, options: UseDebounceOptions = {}): T {
  const { delay = DEBOUNCE.DEFAULT_DELAY } = options
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(timer)
    }
  }, [value, delay])

  return debouncedValue
}

/**
 * Debounce a callback function
 */
export function useDebounceCallback<T extends (...args: unknown[]) => void>(
  callback: T,
  delay: number = DEBOUNCE.DEFAULT_DELAY
): T {
  const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(null)

  useEffect(() => {
    return () => {
      if (debounceTimer) {
        clearTimeout(debounceTimer)
      }
    }
  }, [debounceTimer])

  const debouncedCallback = ((...args: Parameters<T>) => {
    if (debounceTimer) {
      clearTimeout(debounceTimer)
    }

    const timer = setTimeout(() => {
      callback(...args)
    }, delay)

    setDebounceTimer(timer)
  }) as T

  return debouncedCallback
}

