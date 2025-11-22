/**
 * API error handling utilities
 */
import { getErrorMessage, isErrorWithResponse, getErrorStatus } from '../utils/errors'

export class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public code?: string,
    public data?: unknown
  ) {
    super(message)
    this.name = 'ApiError'
    Object.setPrototypeOf(this, ApiError.prototype)
  }
}

/**
 * Create an ApiError from an unknown error
 */
export function createApiError(error: unknown): ApiError {
  if (error instanceof ApiError) {
    return error
  }

  const message = getErrorMessage(error)
  const status = getErrorStatus(error)
  let data: unknown = undefined

  if (isErrorWithResponse(error) && error.response?.data) {
    data = error.response.data
  }

  return new ApiError(message, status, undefined, data)
}

/**
 * Check if an error is an ApiError
 */
export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError
}

/**
 * Format API error for display
 */
export function formatApiError(error: unknown): string {
  if (isApiError(error)) {
    return error.message
  }

  return getErrorMessage(error)
}

