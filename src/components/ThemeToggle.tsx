import { useThemeStore } from '../store/themeStore'
import './ThemeToggle.css'

function ThemeToggle() {
  const { theme, effectiveTheme, setTheme } = useThemeStore()

  const cycleTheme = () => {
    if (theme === 'light') {
      setTheme('dark')
    } else if (theme === 'dark') {
      setTheme('system')
    } else {
      setTheme('light')
    }
  }

  const getIcon = () => {
    if (theme === 'system') {
      return '💻'
    }
    return effectiveTheme === 'light' ? '☀️' : '🌙'
  }

  const getLabel = () => {
    if (theme === 'system') {
      return `System (${effectiveTheme})`
    }
    return theme === 'light' ? 'Light' : 'Dark'
  }

  return (
    <button
      className="theme-toggle"
      onClick={cycleTheme}
      aria-label={`Current theme: ${getLabel()}. Click to cycle themes.`}
      title={`Theme: ${getLabel()}`}
    >
      <span className="theme-icon">{getIcon()}</span>
      <span className="theme-label">{getLabel()}</span>
    </button>
  )
}

export default ThemeToggle
