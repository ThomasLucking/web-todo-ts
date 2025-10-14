import { clearError, showError } from '../components/errorHandler'
import {
  attachTaskEventListeners,
  createTaskElement,
} from '../components/taskElement'
import type { Tasks } from '../types'
import { randomId } from '../utils/IdGeneration'
import { deleteAllTasks, getTasks, saveTasks } from '../utils/storage'

const addTaskButton =
  document.querySelector<HTMLButtonElement>('#add-todo-button')
const inputValue = document.querySelector<HTMLInputElement>('#todo-input')
const taskCreatedSection =
  document.querySelector<HTMLUListElement>('#todo-elements')
const errorMessage = document.querySelector<HTMLDivElement>('#error-message')

const deleteAllbutton = document.querySelector<HTMLButtonElement>('#delete-all')

const todoDates = document.querySelector<HTMLInputElement>('#todo-date-input')

if (
  !addTaskButton ||
  !inputValue ||
  !taskCreatedSection ||
  !errorMessage ||
  !deleteAllbutton ||
  !todoDates
) {
  console.error('Missing a Dom element')
  throw new Error('Missing a DOM element. Aborting script.')
}
export const renderTask = (task: Tasks): void => {
  const elements = createTaskElement(task)
  attachTaskEventListeners(elements, task)
  taskCreatedSection.append(elements.taskItem)
}

export const createTask = async (): Promise<void> => {
  const value = inputValue.value.trim()

  if (!value) {
    showError('Please enter a task', errorMessage)
    return
  }

  clearError(errorMessage)
  const newTask: Tasks = {
    text: value,
    completed: false,
    id: randomId(),
    dueDate: todoDates.value,
  }
  renderTask(newTask)
  inputValue.value = ''
  todoDates.value = ''
  const tasks = await getTasks(localStorage)
  tasks.push(newTask)
  await saveTasks(tasks, localStorage)
}

export const loadTasks = async (): Promise<void> => {
  const tasks = await getTasks(localStorage)
  console.log(tasks)
  tasks.forEach(renderTask)
}

export const handleDeleteAll = async (): Promise<void> => {
  await deleteAllTasks(localStorage)
  taskCreatedSection.innerHTML = ''
}
