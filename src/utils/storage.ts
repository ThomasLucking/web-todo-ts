import type { Tasks } from '../types/index'

const STORAGE_KEY = 'tasks' as const

// this function gets the tasks and uses try and catch if it fails to parse or gets the task.
export const getTasks = (): Tasks[] => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]')
  } catch (_error) {
    console.error('Failed to parse tasks:', _error)
    return []
  }
}

// this function saves the task as STORAGE_KEY and catches errors if it fails to save the task
export const saveTasks = (tasks: Tasks[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
  } catch (_error) {
    console.error('Failed to save tasks.', _error)
  }
}

export const deleteTasks = (taskId: string): void => {
  const tasks = getTasks() // gets all the tasks
  const updatedTasks = tasks.filter((task) => task.id !== taskId) // filters the tasks to correspond to the specific ID.
  saveTasks(updatedTasks)
}

export const deleteAllTasks = (): void => {
  try {
    localStorage.clear()
  } catch (_error) {
    console.error('Failed to delete tasks.', _error)
  }
}
