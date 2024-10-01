import { addWeeks, isAfter, isBefore, isSameDay } from 'date-fns'
import type { Round } from '~/types/models'

export interface ShotDay {
  date: Date
  units: number
  taken: boolean
  isToday: boolean
}

export const useRound = (round: Round) => {
  const shotDates = (): Date[] => {
    const portions = round.ml * 100 / round.units

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

  const shotDays = (): ShotDay[] => {
    const today = new Date()
    return shotDates().map(date => ({
      date,
      units: round.units,
      taken: isBefore(date, today),
      isToday: isSameDay(date, today),
    }))
  }

  const isShotDayToday = (): boolean => shotDays().some(day => isSameDay(day.date, new Date()))

  const lastShotDate = () => shotDates().slice(-1)[0] as Date

  const nextRoundDate = () => addWeeks(lastShotDate(), 1)

  const title = () => `${round.user.name} - ${round.content} ${round.mg}mg`

  const shotDaysLeft = (): number => {
    const today = new Date()
    return shotDays().filter(day => isAfter(day.date, today) || isSameDay(day.date, today)).length
  }

  const unitsRemain = (): number => {
    const today = new Date()
    return shotDays()
      .filter(day => isAfter(day.date, today) || isSameDay(day.date, today))
      .reduce((total, day) => total + day.units, 0)
  }

  // 200 units = 20mg so 50 units is 5mg
  const mgPerUnits = (): number => round.mg * round.units / (round.ml * 100)

  return {
    shotDates,
    lastShotDate,
    nextRoundDate,
    shotDays,
    shotDaysLeft,
    isShotDayToday,
    unitsRemain,
    mgPerUnits,
    title,
  }
}
