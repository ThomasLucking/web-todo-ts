import './assets/style.css'
import {
  createTask,
  handleDeleteAll,
  loadTasks,
} from './hooks/hooksEventHandler'

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

addTaskButton.addEventListener('click', () => {
  createTask()
})

deleteAllbutton.addEventListener('click', handleDeleteAll)
inputValue.addEventListener('keydown', (event: KeyboardEvent) => {
  if (event.key === 'Enter') {
    createTask()
  }
})

window.addEventListener('DOMContentLoaded', loadTasks)
