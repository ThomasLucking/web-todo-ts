import './style.css'
import type { Tasks } from './types'
import { getTasks, saveTasks, deleteAllTasks } from './utils/storage'
import { randomId } from './utils/IdGeneration'
import { createTaskElement, attachTaskEventListeners } from './components/taskElement'
import { showError, clearError } from './components/errorHandler'

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

const renderTask = (task: Tasks): void => {
  const elements = createTaskElement(task)
  attachTaskEventListeners(elements, task)
  taskCreatedSection.append(elements.taskItem)
}

const createTask = (): void => {
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
  const tasks = getTasks()
  tasks.push(newTask)
  saveTasks(tasks)
}

const loadTasks = (): void => {
  const tasks = getTasks()
  console.log(tasks)
  tasks.forEach(renderTask)
}

const handleDeleteAll = (): void => {
  deleteAllTasks()
  taskCreatedSection.innerHTML = ''
}

addTaskButton.addEventListener('click', createTask)
deleteAllbutton.addEventListener('click', handleDeleteAll)
inputValue.addEventListener('keydown', (event: KeyboardEvent) => {
  if (event.key === 'Enter') {
    createTask()
  }
})

window.addEventListener('DOMContentLoaded', loadTasks)