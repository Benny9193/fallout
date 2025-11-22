import './ErrorDisplay.css'

interface ErrorDisplayProps {
  error: Error | unknown
  title?: string
  message?: string
  onRetry?: () => void
  retryLabel?: string
  showDetails?: boolean
}

function ErrorDisplay({
  error,
  title = 'Something went wrong',
  message,
  onRetry,
  retryLabel = 'Try again',
  showDetails = false,
}: ErrorDisplayProps) {
  const errorMessage =
    message ||
    (error instanceof Error ? error.message : 'An unexpected error occurred')

  return (
    <div className="error-display" role="alert">
      <div className="error-display-content">
        <div className="error-display-icon" aria-hidden="true">
          ⚠️
        </div>
        <h3 className="error-display-title">{title}</h3>
        <p className="error-display-message">{errorMessage}</p>
        {showDetails && error instanceof Error && error.stack && (
          <details className="error-display-details">
            <summary className="error-display-summary">Error details</summary>
            <pre className="error-display-stack">{error.stack}</pre>
          </details>
        )}
        {onRetry && (
          <button
            className="error-display-button"
            onClick={onRetry}
            type="button"
            aria-label={retryLabel}
          >
            {retryLabel}
          </button>
        )}
      </div>
    </div>
  )
}

export default ErrorDisplay

