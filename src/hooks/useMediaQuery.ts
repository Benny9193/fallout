import { useState, useEffect } from 'react'
import { BREAKPOINTS } from '../constants/app'

/**
 * Hook to track media query matches
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState<boolean>(() => {
    if (typeof window === 'undefined') {
      return false
    }
    return window.matchMedia(query).matches
  })

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    const mediaQuery = window.matchMedia(query)

    // Update state if the media query matches on mount
    const updateMatches = () => {
      setMatches(mediaQuery.matches)
    }

    // Set initial value
    updateMatches()

    // Listen for changes
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', updateMatches)
      return () => {
        mediaQuery.removeEventListener('change', updateMatches)
      }
    } else {
      // Fallback for older browsers
      mediaQuery.addListener(updateMatches)
      return () => {
        mediaQuery.removeListener(updateMatches)
      }
    }
  }, [query])

  return matches
}

/**
 * Hook to check if screen size is above a breakpoint
 */
export function useBreakpoint(breakpoint: keyof typeof BREAKPOINTS): boolean {
  const query = `(min-width: ${BREAKPOINTS[breakpoint]}px)`
  return useMediaQuery(query)
}

/**
 * Hook to check if the user prefers dark mode
 */
export function usePrefersDarkMode(): boolean {
  return useMediaQuery('(prefers-color-scheme: dark)')
}

/**
 * Hook to check if the user prefers reduced motion
 */
export function usePrefersReducedMotion(): boolean {
  return useMediaQuery('(prefers-reduced-motion: reduce)')
}

