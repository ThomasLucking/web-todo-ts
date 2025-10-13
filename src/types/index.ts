export interface Tasks {
  id: string
  text: string
  completed: boolean
  dueDate: string
}

export const TODO_ITEM_CLASS = 'todo-item' as const
export const CHECKBOX_ITEM_CLASS = 'todo-checkbox' as const
export const SPAN_TEXT_CLASS = 'todo-span' as const
export const DELETE_TASK_CLASS = 'todo-delete' as const
export const TODO_DATE = 'todo-date' as const
export const OVERDUE_MESSAGE = 'overdue-message' as const

export const DATE_RANGES = {
  OVERDUE: { bg: 'red', color: 'black' },
  TODAY: { bg: 'orange', color: 'black' },
  SOON: { bg: 'yellow', color: 'black' },
  FUTURE: { bg: 'green', color: 'black' },
} as const
