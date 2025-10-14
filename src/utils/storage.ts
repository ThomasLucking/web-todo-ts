import type { Tasks } from '../types/index'

const STORAGE_KEY = 'tasks'

// this function gets the tasks and uses try and catch if it fails to parse or gets the task.
// a promise represents a value that might be available yet.
export const getTasks = (storage: Storage): Promise<Tasks[]> => {
  try {
    const task = JSON.parse(storage.getItem(STORAGE_KEY) ?? '[]')
    return Promise.resolve(task)
  } catch (_error) {
    console.error('Failed to parse tasks:', _error)
    return Promise.resolve([])
  }
}

// this function saves the task as STORAGE_KEY and catches errors if it fails to save the task
export const saveTasks = async (
  tasks: Tasks[],
  storage: Storage,
): Promise<void> => {
  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(tasks))
  } catch (_error) {
    console.error('Failed to save tasks.', _error)
  }
}

export const deleteTasks = async (
  taskId: string,
  storage: Storage,
): Promise<void> => {
  const tasks = await getTasks(storage) // gets all the tasks
  const updatedTasks = tasks.filter((task) => task.id !== taskId) // filters the tasks to correspond to the specific ID.
  await saveTasks(updatedTasks, storage) // saves the updated tasks to local storage.
}

export const deleteAllTasks = async (storage: Storage): Promise<void> => {
  try {
    storage.clear()
  } catch (_error) {
    console.error('Failed to delete tasks.', _error)
  }
}
