import type { Round } from '@prisma/client'
import { addWeeks } from 'date-fns'

export const useRound = (round: Round) => {
  const shotDays = (): Date[] => {
    const portions = round.portions || 4

    const getNextDate = (index: number): Date => {
      switch (round.frequency) {
        // Placeholder for future frequencies
        // case 'biweekly':
        // case 'monthly':
        default:
          return addWeeks(round.date, index)
      }
    }

    return Array.from({ length: portions }, (_, i) => getNextDate(i))
  }

  const lastShotDay = () => shotDays().slice(-1)[0]

  const nextRoundDay = () => addWeeks(lastShotDay(), 1)

  return {
    shotDays,
    lastShotDay,
    nextRoundDay,
  }
}
