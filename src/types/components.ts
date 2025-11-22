/**
 * Component prop types
 */

import type { ReactNode } from 'react'

export interface LoadingProps {
  message?: string
  size?: 'small' | 'medium' | 'large'
  fullScreen?: boolean
}

export interface ErrorDisplayProps {
  error: Error | unknown
  title?: string
  message?: string
  onRetry?: () => void
  retryLabel?: string
  showDetails?: boolean
}

export interface EmptyStateProps {
  title?: string
  message?: string
  icon?: string
  action?: {
    label: string
    onClick: () => void
  }
}

export interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: ReactNode
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void
}

