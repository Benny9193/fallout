import { z } from 'zod'

export const CounterStateSchema = z.object({
  count: z.number().int().safe(),
})

export const ThemeSchema = z.enum(['light', 'dark', 'system'])

export const ThemeStateSchema = z.object({
  theme: ThemeSchema,
  effectiveTheme: z.enum(['light', 'dark']),
})

export type CounterState = z.infer<typeof CounterStateSchema>
export type Theme = z.infer<typeof ThemeSchema>
export type ThemeState = z.infer<typeof ThemeStateSchema>
