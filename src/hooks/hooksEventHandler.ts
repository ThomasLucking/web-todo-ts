import type { ApiTask, SavedApiTask } from '../apihandling/apihandle'
import {
  deleteAllTasksViaAPI,
  fetchTasks,
  saveTasksViaAPI,
} from '../apihandling/apihandle'
import { clearError, showError } from '../components/errorHandler'
import {
  attachTaskEventListeners,
  createTaskElement,
} from '../components/taskElement'
import { PreventTaskCreation } from '../utils/date'

// import { Tasks } from '../types'
//import { randomId } from '../utils/IdGeneration'

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
export const renderTask = (task: SavedApiTask): void => {
  const elements = createTaskElement(task)
  attachTaskEventListeners(elements, task)
  if (task.done) {
    elements.checkbox.checked = true
    elements.taskItem.classList.add('completed')
  }
  taskCreatedSection.append(elements.taskItem)
}

export const createTask = async (): Promise<void> => {
  const value = inputValue.value.trim()

  PreventTaskCreation(todoDates.value, new Date())

  if (!value) {
    showError('Please enter a task', errorMessage)
    return
  }

  clearError(errorMessage)
  // in createTask
  const newTask: ApiTask = {
    title: value,
    content: value,
    done: false,
    due_date: todoDates.value || null,
  }

  inputValue.value = ''
  todoDates.value = ''
  // console.log(newTask)
  const savedTask = await saveTasksViaAPI(newTask)
  console.log('Saved task returned:', savedTask)
  renderTask(savedTask)
  console.log('Called renderTask')
}

export const loadTasks = async (): Promise<void> => {
  const tasks: SavedApiTask[] = await fetchTasks()
  tasks.forEach((task) => {
    renderTask(task)
  })
}

export const handleDeleteAll = async (): Promise<void> => {
  await deleteAllTasksViaAPI()
  taskCreatedSection.innerHTML = ''
}
