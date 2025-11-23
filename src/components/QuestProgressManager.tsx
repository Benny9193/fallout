import { useState, useRef } from 'react'
import { useQuestProgressStore } from '../store/questProgressStore'
import './QuestProgressManager.css'

interface QuestProgressManagerProps {
  onClose: () => void
}

function QuestProgressManager({ onClose }: QuestProgressManagerProps) {
  const [activeTab, setActiveTab] = useState<'export' | 'import'>('export')
  const [importData, setImportData] = useState('')
  const [mergeMode, setMergeMode] = useState(false)
  const [importStatus, setImportStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [exportStatus, setExportStatus] = useState<'idle' | 'success'>('idle')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const exportAllProgress = useQuestProgressStore((state) => state.exportAllProgress)
  const importProgress = useQuestProgressStore((state) => state.importProgress)

  // Export to JSON file
  const handleExportToFile = () => {
    const data = exportAllProgress()
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `fallout-quest-progress-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
    setExportStatus('success')
    setTimeout(() => setExportStatus('idle'), 3000)
  }

  // Copy to clipboard
  const handleCopyToClipboard = () => {
    const data = exportAllProgress()
    navigator.clipboard.writeText(data).then(() => {
      setExportStatus('success')
      setTimeout(() => setExportStatus('idle'), 3000)
    })
  }

  // Import from file
  const handleFileSelect = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        const text = event.target?.result as string
        setImportData(text)
      }
      reader.readAsText(file)
    }
  }

  // Import from text
  const handleImport = () => {
    if (!importData.trim()) {
      setImportStatus('error')
      return
    }

    const success = importProgress(importData, mergeMode)
    if (success) {
      setImportStatus('success')
      setImportData('')
      setTimeout(() => {
        onClose()
      }, 1500)
    } else {
      setImportStatus('error')
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content quest-progress-manager" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <h2>Quest Progress Manager</h2>
          <button className="modal-close" onClick={onClose}>
            ✕
          </button>
        </div>

        {/* Tabs */}
        <div className="modal-tabs">
          <button
            className={`modal-tab ${activeTab === 'export' ? 'active' : ''}`}
            onClick={() => setActiveTab('export')}
          >
            📤 Export
          </button>
          <button
            className={`modal-tab ${activeTab === 'import' ? 'active' : ''}`}
            onClick={() => setActiveTab('import')}
          >
            📥 Import
          </button>
        </div>

        {/* Content */}
        <div className="modal-body">
          {activeTab === 'export' ? (
            <div className="export-section">
              <p className="section-description">
                Export your quest progress, notes, and timeline to backup or share with others.
              </p>

              <div className="export-actions">
                <button className="btn-primary" onClick={handleExportToFile}>
                  💾 Download as File
                </button>
                <button className="btn-secondary" onClick={handleCopyToClipboard}>
                  📋 Copy to Clipboard
                </button>
              </div>

              {exportStatus === 'success' && (
                <div className="status-message success">
                  ✓ Exported successfully!
                </div>
              )}

              <div className="export-info">
                <h4>What's included:</h4>
                <ul>
                  <li>Quest status and progress</li>
                  <li>Completed objectives</li>
                  <li>Quest notes and attachments</li>
                  <li>Activity timeline</li>
                  <li>Collected rewards</li>
                </ul>
              </div>
            </div>
          ) : (
            <div className="import-section">
              <p className="section-description">
                Import quest progress from a previously exported file or JSON data.
              </p>

              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                accept=".json,application/json"
                onChange={handleFileChange}
                style={{ display: 'none' }}
              />

              <div className="import-actions">
                <button className="btn-secondary" onClick={handleFileSelect}>
                  📁 Select File
                </button>
              </div>

              <div className="import-textarea-container">
                <textarea
                  value={importData}
                  onChange={(e) => setImportData(e.target.value)}
                  placeholder="Or paste JSON data here..."
                  className="import-textarea"
                  rows={8}
                />
              </div>

              <div className="import-options">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={mergeMode}
                    onChange={(e) => setMergeMode(e.target.checked)}
                  />
                  <span>Merge with existing data (instead of replacing)</span>
                </label>
              </div>

              <div className="import-button-group">
                <button
                  className="btn-primary"
                  onClick={handleImport}
                  disabled={!importData.trim()}
                >
                  Import Progress
                </button>
              </div>

              {importStatus === 'success' && (
                <div className="status-message success">
                  ✓ Imported successfully!
                </div>
              )}
              {importStatus === 'error' && (
                <div className="status-message error">
                  ✕ Import failed. Please check the data format.
                </div>
              )}

              <div className="import-warning">
                <strong>Warning:</strong> Importing will {mergeMode ? 'merge with' : 'replace'} your current progress. Make sure to export a backup first!
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default QuestProgressManager
