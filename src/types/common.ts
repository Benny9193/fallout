/**
 * Common utility types
 */

/**
 * Make specific properties optional
 */
export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>

/**
 * Make specific properties required
 */
export type RequiredBy<T, K extends keyof T> = T & Required<Pick<T, K>>

/**
 * Extract the value type from an object type
 */
export type ValueOf<T> = T[keyof T]

/**
 * Deep readonly type
 */
export type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object ? DeepReadonly<T[P]> : T[P]
}

/**
 * Non-empty array type
 */
export type NonEmptyArray<T> = [T, ...T[]]

/**
 * Branded type for stronger type safety
 */
export type Brand<T, B> = T & { __brand: B }

/**
 * Omit keys with specific value types
 */
export type OmitByType<T, U> = {
  [K in keyof T as T[K] extends U ? never : K]: T[K]
}

