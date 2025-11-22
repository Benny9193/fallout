import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { persist } from 'zustand/middleware/persist'
import { CounterStateSchema } from './schemas'

interface CounterState {
  count: number
  increment: () => void
  decrement: () => void
  reset: () => void
}

export const useCounterStore = create<CounterState>()(
  immer(
    persist(
      (set) => ({
        count: 0,
        increment: () => set((state) => {
          state.count += 1
        }),
        decrement: () => set((state) => {
          state.count -= 1
        }),
        reset: () => set((state) => {
          state.count = 0
        }),
      }),
      {
        name: 'counter-store',
        onRehydrateStorage: () => (state) => {
          // Validate state on rehydration
          if (state) {
            try {
              CounterStateSchema.parse({ count: state.count })
            } catch (error) {
              console.warn('Counter state validation failed, resetting to default')
              state.count = 0
            }
          }
        },
      }
    )
  )
)
