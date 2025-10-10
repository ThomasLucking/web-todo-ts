import './style.css'

const addTaskButton =
  document.querySelector<HTMLButtonElement>('#add-todo-button')
const inputValue = document.querySelector<HTMLInputElement>('#todo-input')
const taskCreatedSection =
  document.querySelector<HTMLUListElement>('#todo-elements')
const errorMessage = document.querySelector<HTMLDivElement>('#error-message')

const STORAGE_KEY = 'tasks' as const
const TODO_ITEM_CLASS = 'todo-item' as const
const CHECKBOX_ITEM_CLASS = 'todo-checkbox' as const
const SPAN_TEXT_CLASS = 'todo-span' as const
const DELETE_TASK_CLASS = 'todo-delete' as const

interface Tasks {
  id: string
  text: string
  completed: boolean
}

if (!addTaskButton || !inputValue || !taskCreatedSection || !errorMessage) {
  console.error('Missing a Dom element')
  throw new Error('Missing a DOM element. Aborting script.')
}
// this function gets the tasks and uses try and catch if it fails to parse or gets the task.
const getTasks = (): Tasks[] => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]')
  } catch (_error) {
    console.error('Failed to parse tasks:', _error)
    return []
  }
}
// this function saves the task as STORAGE_KEY and catches errors if it fails to save the task
const saveTasks = (tasks: Tasks[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
  } catch (_error) {
    console.error('Failed to save tasks.', _error)
  }
}


const deleteTasks = (taskId: string): void => {
  try {
    const tasks = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); // gets al the tasks
    const updatedTasks = tasks.filter((task: Tasks) => task.id !== taskId); // filters the tasks to correspond to the specific ID.
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedTasks));
  } catch (_error) {
    console.error('Failed to delete tasks.', _error)
  }
}


// this renders the tasks UI and value
const renderTask = (task: Tasks): void => {
  const taskItem = document.createElement('li')
  taskItem.classList.add(TODO_ITEM_CLASS)
  if (task.completed) {
    taskItem.classList.add('completed')
  }

  const checkbox = document.createElement('input')
  checkbox.type = 'checkbox'
  checkbox.checked = task.completed
  checkbox.classList.add(CHECKBOX_ITEM_CLASS)

  const textSpan = document.createElement('span')
  textSpan.textContent = task.text
  textSpan.classList.add(SPAN_TEXT_CLASS)

  const deleteElement = document.createElement('button')
  deleteElement.textContent = 'Remove'
  deleteElement.classList.add(DELETE_TASK_CLASS)

  taskItem.append(checkbox, textSpan, deleteElement)
  taskCreatedSection.append(taskItem)

  checkbox.addEventListener('change', () => {
    task.completed = checkbox.checked
    if (task.completed) {
      taskItem.classList.add('completed')
    } else {
      taskItem.classList.remove('completed')
    }
    const tasks = getTasks()
    const taskToUpdate = tasks.find((t) => t.id === task.id)

    if (taskToUpdate) {
      taskToUpdate.completed = task.completed
    }

    saveTasks(tasks)
  })

  deleteElement.addEventListener('click', () =>{
    taskItem.remove()
    deleteTasks(task.id)
  })

}

// error handling
const showError = (message: string): void => {
  errorMessage.textContent = message
}
// error handling
const clearError = (): void => {
  errorMessage.textContent = ''
}

const randomId = (length = 6) => {
  return Math.random()
    .toString(36)
    .substring(2, length + 2)
}

const createTask = (): void => {
  const value = inputValue.value.trim()

  if (!value) {
    showError('Please enter a task')
    return
  }

  clearError()
  const newTask: Tasks = { text: value, completed: false, id: randomId(10) }
  renderTask(newTask)
  inputValue.value = ''
  const tasks = getTasks()
  tasks.push(newTask)
  saveTasks(tasks)
}

const loadTasks = (): void => {
  const tasks = getTasks()
  console.log(tasks)
  tasks.forEach(renderTask)
}

addTaskButton.addEventListener('click', createTask)



inputValue.addEventListener('keydown', (event: KeyboardEvent) => {
  if (event.key === 'Enter') {
    createTask()
  }
})

window.addEventListener('DOMContentLoaded', loadTasks)
