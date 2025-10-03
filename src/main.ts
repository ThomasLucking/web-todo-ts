import './style.css'

const addTaskButton =
  document.querySelector<HTMLButtonElement>('#add-todo-button')
const inputValue = document.querySelector<HTMLInputElement>('#todo-input')
const taskCreatedSection =
  document.querySelector<HTMLUListElement>('#todo-elements')
const errorMessage = document.querySelector<HTMLDivElement>('#error-message')

const STORAGE_KEY = 'tasks' as const
const TODO_ITEM_CLASS = 'todo-item' as const

if (!addTaskButton || !inputValue || !taskCreatedSection || !errorMessage) {
  console.error('Missing a Dom element')
  throw new Error('Missing a DOM element. Aborting script.')
}
// this function gets the tasks and uses try and catch if it fails to parse or gets the task.
const getTasks = (): string[] => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]')
  } catch (_error) {
    console.error('Failed to parse tasks:', _error)
    return []
  }
}
// this function saves the task as STORAGE_KEY and catches errors if it fails to save the task
const saveTasks = (tasks: string[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
    console.log('tasks saved')
  } catch (_error) {
    console.log('Failed to save tasks.')
  }
}
// this renders the tasks UI and value
const renderTask = (taskText: string): void => {
  const task = document.createElement('li')
  task.classList.add(TODO_ITEM_CLASS)
  task.textContent = taskText
  taskCreatedSection.append(task)
}
// error handling
const showError = (message: string): void => {
  errorMessage.textContent = message
}
// error handling
const clearError = (): void => {
  errorMessage.textContent = ''
}
// this creates the tasks using the functions above.
const createTask = (): void => {
  const value = inputValue.value.trim()

  if (!value) {
    showError('Please enter a task')
    return
  }

  clearError()
  renderTask(value)
  inputValue.value = ''
  const tasks = getTasks()
  tasks.push(value)
  saveTasks(tasks)
}

const loadTasks = () => {
  const tasks = getTasks()
  tasks.forEach(renderTask)
}

addTaskButton.addEventListener('click', createTask)

inputValue.addEventListener('keydown', (event: KeyboardEvent) => {
  if (event.key === 'Enter') {
    createTask()
  }
})

// transforms the json into text then takes it from localstorage
window.addEventListener('DOMContentLoaded', loadTasks)
