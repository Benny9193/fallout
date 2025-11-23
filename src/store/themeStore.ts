import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { STORAGE_KEYS } from '../constants/api'
import { getLocalStorageItem, setLocalStorageItem } from '../utils/storage'
import { ThemeSchema, type Theme, type ThemeState } from './schemas'

const getSystemTheme = (): 'light' | 'dark' => {
  if (typeof window === 'undefined') return 'light'
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

const getStoredTheme = (): Theme => {
  if (typeof window === 'undefined') return 'system'
  const stored = getLocalStorageItem<unknown>(STORAGE_KEYS.THEME, 'system')
  try {
    return ThemeSchema.parse(stored)
  } catch {
    return 'system'
  }
}

const calculateEffectiveTheme = (theme: Theme): 'light' | 'dark' => {
  return theme === 'system' ? getSystemTheme() : theme
}

export const useThemeStore = create<ThemeState>()(
  devtools(
    (set) => {
      const initialTheme = getStoredTheme()
      const initialEffectiveTheme = calculateEffectiveTheme(initialTheme)

      // Apply initial theme to document
      if (typeof document !== 'undefined') {
        document.documentElement.setAttribute('data-theme', initialEffectiveTheme)
      }

      // Listen for system theme changes
      if (typeof window !== 'undefined') {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
        mediaQuery.addEventListener('change', (e) => {
          set((state) => {
            if (state.theme === 'system') {
              const newEffectiveTheme = e.matches ? 'dark' : 'light'
              if (typeof document !== 'undefined') {
                document.documentElement.setAttribute('data-theme', newEffectiveTheme)
              }
              return { ...state, effectiveTheme: newEffectiveTheme }
            }
            return state
          })
        })
      }

      return {
        theme: initialTheme,
        effectiveTheme: initialEffectiveTheme,
        setTheme: (theme: Theme) => {
          const effectiveTheme = calculateEffectiveTheme(theme)
          setLocalStorageItem(STORAGE_KEYS.THEME, theme)
          if (typeof document !== 'undefined') {
            document.documentElement.setAttribute('data-theme', effectiveTheme)
          }
          set({ theme, effectiveTheme })
        },
      }
    },
    { name: 'ThemeStore' }
  )
)
