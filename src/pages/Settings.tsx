import { useState, forwardRef, useEffect } from 'react'
import { useThemeStore } from '../store/themeStore'
import { useScrollAnimation } from '../hooks/useScrollAnimation'
import './Settings.css'

type Theme = 'light' | 'dark' | 'system'

interface SettingsState {
  theme: Theme
  notifications: boolean
  emailUpdates: boolean
}

interface SettingsSectionProps {
  title: string
  description?: string
  children: React.ReactNode
}

const DEFAULT_SETTINGS: SettingsState = {
  theme: 'system',
  notifications: true,
  emailUpdates: false,
}

const STORAGE_KEY = 'app-settings'

function Settings() {
  const { theme: currentTheme, setTheme } = useThemeStore()
  const appearanceRef = useScrollAnimation()
  const notificationsRef = useScrollAnimation()
  const actionsRef = useScrollAnimation()

  // Load settings from localStorage on mount
  const [settings, setSettings] = useState<SettingsState>(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        return { ...DEFAULT_SETTINGS, ...parsed }
      } catch {
        return DEFAULT_SETTINGS
      }
    }
    return {
      ...DEFAULT_SETTINGS,
      theme: currentTheme,
    }
  })

  const [hasChanges, setHasChanges] = useState(false)
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')

  // Sync theme from store
  useEffect(() => {
    setSettings((prev) => ({ ...prev, theme: currentTheme }))
  }, [currentTheme])

  // Check for changes
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        const hasThemeChange = parsed.theme !== settings.theme
        const hasNotificationChange = parsed.notifications !== settings.notifications
        const hasEmailChange = parsed.emailUpdates !== settings.emailUpdates
        setHasChanges(hasThemeChange || hasNotificationChange || hasEmailChange)
      } catch {
        setHasChanges(true)
      }
    } else {
      const isDefault =
        settings.theme === DEFAULT_SETTINGS.theme &&
        settings.notifications === DEFAULT_SETTINGS.notifications &&
        settings.emailUpdates === DEFAULT_SETTINGS.emailUpdates
      setHasChanges(!isDefault)
    }
  }, [settings])

  const handleThemeChange = (theme: Theme) => {
    setTheme(theme)
    setSettings((prev) => ({ ...prev, theme }))
  }

  const handleNotificationChange = (notifications: boolean) => {
    setSettings((prev) => ({ ...prev, notifications }))
  }

  const handleEmailChange = (emailUpdates: boolean) => {
    setSettings((prev) => ({ ...prev, emailUpdates }))
  }

  const handleSave = async () => {
    setSaveStatus('saving')
    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 500))
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
      setSaveStatus('saved')
      setHasChanges(false)
      setTimeout(() => setSaveStatus('idle'), 2000)
    } catch {
      setSaveStatus('error')
      setTimeout(() => setSaveStatus('idle'), 3000)
    }
  }

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset all settings to default values?')) {
      setTheme(DEFAULT_SETTINGS.theme)
      setSettings(DEFAULT_SETTINGS)
      localStorage.removeItem(STORAGE_KEY)
      setSaveStatus('idle')
      setHasChanges(false)
    }
  }

  const canSave = hasChanges && saveStatus !== 'saving'

  return (
    <div className="page settings-page">
      <div className="settings-header">
        <h1>Settings</h1>
        <p>Customize your app preferences and configuration</p>
      </div>

      <div className="settings-container">
        <AppearanceSection
          ref={appearanceRef}
          theme={settings.theme}
          onThemeChange={handleThemeChange}
        />
        <NotificationsSection
          ref={notificationsRef}
          notifications={settings.notifications}
          emailUpdates={settings.emailUpdates}
          onNotificationChange={handleNotificationChange}
          onEmailChange={handleEmailChange}
        />
        <SettingsActions
          ref={actionsRef}
          onSave={handleSave}
          onReset={handleReset}
          canSave={canSave}
          saveStatus={saveStatus}
        />
      </div>
    </div>
  )
}

interface AppearanceSectionProps {
  theme: Theme
  onThemeChange: (theme: Theme) => void
}

const AppearanceSection = forwardRef<HTMLDivElement, AppearanceSectionProps>(
  ({ theme, onThemeChange }, ref) => {
    return (
      <SettingsSection
        ref={ref}
        title="Appearance"
        description="Customize the visual appearance of the application"
      >
        <div className="setting-item">
          <label htmlFor="theme-select">
            <span className="setting-label">Theme</span>
            <span className="setting-description">
              Choose your preferred color theme. System will follow your device settings.
            </span>
          </label>
          <select
            id="theme-select"
            value={theme}
            onChange={(e) => onThemeChange(e.target.value as Theme)}
            className="setting-input"
            aria-label="Select theme preference"
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
            <option value="system">System</option>
          </select>
        </div>
      </SettingsSection>
    )
  }
)

AppearanceSection.displayName = 'AppearanceSection'

interface NotificationsSectionProps {
  notifications: boolean
  emailUpdates: boolean
  onNotificationChange: (value: boolean) => void
  onEmailChange: (value: boolean) => void
}

const NotificationsSection = forwardRef<HTMLDivElement, NotificationsSectionProps>(
  ({ notifications, emailUpdates, onNotificationChange, onEmailChange }, ref) => {
    return (
      <SettingsSection
        ref={ref}
        title="Notifications"
        description="Manage your notification preferences"
      >
        <div className="setting-item">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={notifications}
              onChange={(e) => onNotificationChange(e.target.checked)}
              className="setting-checkbox"
              aria-label="Enable push notifications"
            />
            <div className="checkbox-content">
              <span className="setting-label">Enable push notifications</span>
              <span className="setting-description">
                Receive real-time notifications in your browser
              </span>
            </div>
          </label>
        </div>
        <div className="setting-item">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={emailUpdates}
              onChange={(e) => onEmailChange(e.target.checked)}
              className="setting-checkbox"
              aria-label="Receive email updates"
            />
            <div className="checkbox-content">
              <span className="setting-label">Receive email updates</span>
              <span className="setting-description">
                Get periodic updates and important announcements via email
              </span>
            </div>
          </label>
        </div>
      </SettingsSection>
    )
  }
)

NotificationsSection.displayName = 'NotificationsSection'

interface SettingsActionsProps {
  onSave: () => void
  onReset: () => void
  canSave: boolean
  saveStatus: 'idle' | 'saving' | 'saved' | 'error'
}

const SettingsActions = forwardRef<HTMLDivElement, SettingsActionsProps>(
  ({ onSave, onReset, canSave, saveStatus }, ref) => {
    const getSaveButtonText = () => {
      switch (saveStatus) {
        case 'saving':
          return 'Saving...'
        case 'saved':
          return 'Saved!'
        case 'error':
          return 'Error - Try Again'
        default:
          return 'Save Changes'
      }
    }

    return (
      <div ref={ref} className="settings-actions fade-up">
        <button
          className="btn-primary"
          onClick={onSave}
          disabled={!canSave || saveStatus === 'saving'}
          aria-label="Save settings changes"
          type="button"
        >
          {saveStatus === 'saving' && (
            <span className="btn-spinner" aria-hidden="true"></span>
          )}
          {saveStatus === 'saved' && (
            <span className="btn-checkmark" aria-hidden="true">✓</span>
          )}
          <span>{getSaveButtonText()}</span>
        </button>
        <button
          className="btn-secondary"
          onClick={onReset}
          aria-label="Reset all settings to default values"
          type="button"
        >
          Reset to Default
        </button>
      </div>
    )
  }
)

SettingsActions.displayName = 'SettingsActions'

const SettingsSection = forwardRef<HTMLDivElement, SettingsSectionProps>(
  ({ title, description, children }, ref) => {
    return (
      <section ref={ref} className="settings-section fade-up">
        <div className="section-header">
          <h2>{title}</h2>
          {description && <p className="section-description">{description}</p>}
        </div>
        <div className="section-content">{children}</div>
      </section>
    )
  }
)

SettingsSection.displayName = 'SettingsSection'

export default Settings
