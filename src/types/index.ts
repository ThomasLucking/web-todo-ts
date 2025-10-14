export interface Tasks {
  id: string
  text: string
  completed: boolean
  dueDate: string
}

export const TODO_ITEM_CLASS = 'todo-item'
export const CHECKBOX_ITEM_CLASS = 'todo-checkbox'
export const SPAN_TEXT_CLASS = 'todo-span'
export const DELETE_TASK_CLASS = 'todo-delete'
export const TODO_DATE = 'todo-date'
export const OVERDUE_MESSAGE = 'overdue-message'

export const DATE_RANGES = {
  OVERDUE: { bg: 'red', color: 'black' },
  TODAY: { bg: 'orange', color: 'black' },
  SOON: { bg: 'yellow', color: 'black' },
  FUTURE: { bg: 'green', color: 'black' },
}
