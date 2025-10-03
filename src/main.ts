import './style.css'

const addTaskButton =
  document.querySelector<HTMLButtonElement>('#add-todo-button')
const inputValue = document.querySelector<HTMLInputElement>('#todo-input')
const taskCreatedSection =
  document.querySelector<HTMLUListElement>('#todo-elements')
const errorMessage = document.querySelector<HTMLDivElement>('#error-message')

if (!addTaskButton || !inputValue || !taskCreatedSection || !errorMessage) {
  console.error('Missing a Dom element')
  throw new Error('Missing a DOM element. Aborting script.')
}

const createTask = () => {
  const value = inputValue.value.trim()

  if (!value) {
    errorMessage.textContent = 'Please enter a task'
    return
  }

  errorMessage.textContent = ''
  const task = document.createElement('li')
  task.classList.add('todo-item')
  task.textContent = value

  taskCreatedSection.append(task)
  inputValue.value = ''
}

addTaskButton.addEventListener('click', createTask)

inputValue.addEventListener('keydown', (event: KeyboardEvent) => {
  if (event.key === 'Enter') {
    createTask()
  }
})
