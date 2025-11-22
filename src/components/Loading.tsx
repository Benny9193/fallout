import './Loading.css'

interface LoadingProps {
  message?: string
  size?: 'small' | 'medium' | 'large'
  fullScreen?: boolean
}

function Loading({ message = 'Loading...', size = 'medium', fullScreen = false }: LoadingProps) {
  const sizeClass = `loading-spinner-${size}`
  const containerClass = fullScreen ? 'loading-container-fullscreen' : 'loading-container'

  return (
    <div className={containerClass} role="status" aria-live="polite" aria-label={message}>
      <div className={`loading-spinner ${sizeClass}`} aria-hidden="true">
        <div className="spinner-circle"></div>
      </div>
      {message && <span className="loading-message">{message}</span>}
    </div>
  )
}

export default Loading

