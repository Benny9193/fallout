import { create } from 'zustand'
import { STORAGE_KEYS } from '../constants/api'
import { getLocalStorageItem, setLocalStorageItem } from '../utils/storage'

type Theme = 'light' | 'dark' | 'system'

interface ThemeState {
  theme: Theme
  effectiveTheme: 'light' | 'dark'
  setTheme: (theme: Theme) => void
}

const getSystemTheme = (): 'light' | 'dark' => {
  if (typeof window === 'undefined') return 'light'
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

const getStoredTheme = (): Theme => {
  if (typeof window === 'undefined') return 'system'
  return getLocalStorageItem<Theme>(STORAGE_KEYS.THEME, 'system')
}

const calculateEffectiveTheme = (theme: Theme): 'light' | 'dark' => {
  return theme === 'system' ? getSystemTheme() : theme
}

export const useThemeStore = create<ThemeState>((set) => {
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
          document.documentElement.setAttribute('data-theme', newEffectiveTheme)
          return { effectiveTheme: newEffectiveTheme }
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
      document.documentElement.setAttribute('data-theme', effectiveTheme)
      set({ theme, effectiveTheme })
    },
  }
})
