/**
 * Error handling utilities and error type guards
 */

/**
 * Type guard to check if an error is an Error instance
 */
export function isError(error: unknown): error is Error {
  return error instanceof Error
}

/**
 * Type guard to check if an error has a response property (Axios error)
 */
export interface ErrorWithResponse {
  response?: {
    status?: number
    statusText?: string
    data?: unknown
  }
}

export function isErrorWithResponse(error: unknown): error is ErrorWithResponse {
  return (
    typeof error === 'object' &&
    error !== null &&
    'response' in error
  )
}

/**
 * Get error message from unknown error type
 */
export function getErrorMessage(error: unknown, fallback = 'An unexpected error occurred'): string {
  if (isError(error)) {
    return error.message
  }

  if (typeof error === 'string') {
    return error
  }

  if (isErrorWithResponse(error) && error.response?.data) {
    const data = error.response.data
    if (typeof data === 'string') {
      return data
    }
    if (typeof data === 'object' && data !== null && 'message' in data) {
      return String(data.message)
    }
  }

  return fallback
}

/**
 * Get HTTP status code from error if available
 */
export function getErrorStatus(error: unknown): number | undefined {
  if (isErrorWithResponse(error)) {
    return error.response?.status
  }
  return undefined
}

/**
 * Check if error is a network error
 */
export function isNetworkError(error: unknown): boolean {
  if (isErrorWithResponse(error)) {
    const status = error.response?.status
    return status === undefined || status === 0
  }
  return false
}

/**
 * Check if error is an authentication error (401)
 */
export function isAuthError(error: unknown): boolean {
  return getErrorStatus(error) === 401
}

/**
 * Check if error is a forbidden error (403)
 */
export function isForbiddenError(error: unknown): boolean {
  return getErrorStatus(error) === 403
}

/**
 * Check if error is a not found error (404)
 */
export function isNotFoundError(error: unknown): boolean {
  return getErrorStatus(error) === 404
}

/**
 * Check if error is a server error (5xx)
 */
export function isServerError(error: unknown): boolean {
  const status = getErrorStatus(error)
  return status !== undefined && status >= 500 && status < 600
}

/**
 * Format error for display
 */
export function formatError(error: unknown): {
  message: string
  status?: number
  isNetworkError: boolean
  isAuthError: boolean
  isServerError: boolean
} {
  return {
    message: getErrorMessage(error),
    status: getErrorStatus(error),
    isNetworkError: isNetworkError(error),
    isAuthError: isAuthError(error),
    isServerError: isServerError(error),
  }
}

