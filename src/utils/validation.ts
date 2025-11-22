/**
 * Validation utilities for form inputs and data
 */

/**
 * Email validation regex
 */
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/**
 * URL validation regex
 */
const URL_REGEX = /^https?:\/\/.+\..+/

/**
 * Validate email address
 */
export function isValidEmail(email: string): boolean {
  if (!email || typeof email !== 'string') return false
  return EMAIL_REGEX.test(email.trim())
}

/**
 * Validate URL
 */
export function isValidUrl(url: string): boolean {
  if (!url || typeof url !== 'string') return false
  try {
    new URL(url)
    return URL_REGEX.test(url.trim())
  } catch {
    return false
  }
}

/**
 * Validate that a string is not empty (after trimming)
 */
export function isNotEmpty(value: string): boolean {
  return typeof value === 'string' && value.trim().length > 0
}

/**
 * Validate minimum length
 */
export function hasMinLength(value: string, minLength: number): boolean {
  return typeof value === 'string' && value.length >= minLength
}

/**
 * Validate maximum length
 */
export function hasMaxLength(value: string, maxLength: number): boolean {
  return typeof value === 'string' && value.length <= maxLength
}

/**
 * Validate length is within a range
 */
export function hasLengthInRange(
  value: string,
  min: number,
  max: number
): boolean {
  return hasMinLength(value, min) && hasMaxLength(value, max)
}

/**
 * Validate that a value is a number
 */
export function isNumber(value: unknown): value is number {
  return typeof value === 'number' && !isNaN(value)
}

/**
 * Validate that a value is a positive number
 */
export function isPositiveNumber(value: unknown): boolean {
  return isNumber(value) && value > 0
}

/**
 * Validate phone number (basic validation)
 */
export function isValidPhoneNumber(phone: string): boolean {
  if (!phone || typeof phone !== 'string') return false
  // Basic phone validation - allows digits, spaces, dashes, parentheses, and +
  const phoneRegex = /^[\d\s\-()+]+$/
  const cleaned = phone.replace(/[\s\-()]/g, '')
  return phoneRegex.test(phone) && cleaned.length >= 10
}

/**
 * Validation result type
 */
export interface ValidationResult {
  isValid: boolean
  error?: string
}

/**
 * Validate email with error message
 */
export function validateEmail(email: string): ValidationResult {
  if (!email) {
    return { isValid: false, error: 'Email is required' }
  }
  if (!isValidEmail(email)) {
    return { isValid: false, error: 'Please enter a valid email address' }
  }
  return { isValid: true }
}

/**
 * Validate URL with error message
 */
export function validateUrl(url: string): ValidationResult {
  if (!url) {
    return { isValid: false, error: 'URL is required' }
  }
  if (!isValidUrl(url)) {
    return { isValid: false, error: 'Please enter a valid URL' }
  }
  return { isValid: true }
}

/**
 * Validate required field
 */
export function validateRequired(value: unknown, fieldName = 'Field'): ValidationResult {
  if (value === null || value === undefined || value === '') {
    return { isValid: false, error: `${fieldName} is required` }
  }
  if (typeof value === 'string' && !isNotEmpty(value)) {
    return { isValid: false, error: `${fieldName} cannot be empty` }
  }
  return { isValid: true }
}

