import { showError } from '../components/errorHandler'
import { DATE_RANGES, OVERDUE_MESSAGE } from '../types/index'

const overdueMessageContainer =
  document.querySelector<HTMLDivElement>('.overdue-Message')
const errorMessage = document.querySelector<HTMLDivElement>('#error-message')

if (!overdueMessageContainer || !errorMessage) {
  console.error('Missing a Dom element')
  throw new Error('Missing a DOM element. Aborting script.')
}
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

export const PreventTaskCreation = (dueDate: string, datenow: Date) => {
  const dueDateObj = new Date(dueDate)

  const dueDateOnly = new Date(
    dueDateObj.getFullYear(),
    dueDateObj.getMonth(),
    dueDateObj.getDate(),
  )
  const todayOnly = new Date(
    datenow.getFullYear(),
    datenow.getMonth(),
    datenow.getDate(),
  )

  if (dueDateOnly < todayOnly) {
    showError('Please enter a valid due date', errorMessage)
    throw new Error('Due date cannot be in the past')
  }
  return
}

export const getColorScheme = (dueDate: string, datenow: Date) => {
  const dueDateObj = new Date(dueDate)

  const dueDateOnly = new Date(
    dueDateObj.getFullYear(),
    dueDateObj.getMonth(),
    dueDateObj.getDate(),
  )
  const todayOnly = new Date(
    datenow.getFullYear(),
    datenow.getMonth(),
    datenow.getDate(),
  )

  if (dueDateOnly < todayOnly) {
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

export const checkOverdueTasks = (
  dueDate: string,
  datenow: Date,
  taskid: number,
): void => {
  const dueDateObj = new Date(dueDate)
  const oldmessage = document.querySelector(`[data-taskid="${taskid}"]`) //assign the data attribute to the message.
  if (!oldmessage) {
    if (dayNumber(dueDateObj) < dayNumber(datenow)) {
      const overdueMessage = document.createElement('p')
      overdueMessage.dataset.taskid = taskid.toString()
      overdueMessage.classList.add(OVERDUE_MESSAGE)
      overdueMessage.textContent = 'Task is overdue'
      overdueMessageContainer.append(overdueMessage)
    }
  }
}
