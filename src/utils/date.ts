import { DATE_RANGES } from '../types/index'

export const dayNumber = (date: Date) =>
  Math.floor(date.getTime() / (1000 * 60 * 60 * 24)) // calculates the day number by multiplying from seconds to minutes to hours to 24 hours.

export const dateRange = (
  dateStr: string,
  daysMin: number,
  daysMax: number,
): boolean => {
  const targetDay = dayNumber(new Date(dateStr)) // target day
  const today = dayNumber(new Date()) // current day

  const diffInDays = targetDay - today // calculate the difference between target day and today
  return diffInDays >= daysMin && diffInDays <= daysMax
}

export const getColorScheme = (dueDate: string, datenow: Date) => {
  const dueDateObj = new Date(dueDate)

  if (dueDateObj < datenow) {
    return DATE_RANGES.OVERDUE
  }
  if (dateRange(dueDate, 0, 0)) {
    return DATE_RANGES.TODAY
  }
  if (dateRange(dueDate, 2, 4)) {
    return DATE_RANGES.SOON
  }
  return DATE_RANGES.FUTURE
}
