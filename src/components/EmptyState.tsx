import './EmptyState.css'

interface EmptyStateProps {
  title?: string
  message?: string
  icon?: string
  action?: {
    label: string
    onClick: () => void
  }
}

function EmptyState({
  title = 'No items found',
  message = 'There are no items to display at the moment.',
  icon = '📭',
  action,
}: EmptyStateProps) {
  return (
    <div className="empty-state" role="status" aria-live="polite">
      <div className="empty-state-content">
        {icon && (
          <div className="empty-state-icon" aria-hidden="true">
            {icon}
          </div>
        )}
        <h3 className="empty-state-title">{title}</h3>
        {message && <p className="empty-state-message">{message}</p>}
        {action && (
          <button
            className="empty-state-button"
            onClick={action.onClick}
            type="button"
            aria-label={action.label}
          >
            {action.label}
          </button>
        )}
      </div>
    </div>
  )
}

export default EmptyState

