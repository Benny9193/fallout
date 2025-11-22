import { useState } from 'react'
import './Settings.css'

function Settings() {
  const [theme, setTheme] = useState('light')
  const [notifications, setNotifications] = useState(true)
  const [emailUpdates, setEmailUpdates] = useState(false)

  const handleSave = () => {
    alert('Settings saved successfully!')
  }

  return (
    <div className="page settings-page">
      <h1>Settings</h1>
      <p>Customize your app preferences</p>

      <div className="settings-container">
        <section className="settings-section">
          <h2>Appearance</h2>
          <div className="setting-item">
            <label htmlFor="theme">Theme</label>
            <select
              id="theme"
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="auto">Auto</option>
            </select>
          </div>
        </section>

        <section className="settings-section">
          <h2>Notifications</h2>
          <div className="setting-item">
            <label>
              <input
                type="checkbox"
                checked={notifications}
                onChange={(e) => setNotifications(e.target.checked)}
              />
              <span>Enable push notifications</span>
            </label>
          </div>
          <div className="setting-item">
            <label>
              <input
                type="checkbox"
                checked={emailUpdates}
                onChange={(e) => setEmailUpdates(e.target.checked)}
              />
              <span>Receive email updates</span>
            </label>
          </div>
        </section>

        <div className="settings-actions">
          <button className="btn-primary" onClick={handleSave}>
            Save Changes
          </button>
          <button className="btn-secondary">
            Reset to Default
          </button>
        </div>
      </div>
    </div>
  )
}

export default Settings
