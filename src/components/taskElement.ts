import type { Tasks } from '../types'
import {
  CHECKBOX_ITEM_CLASS,
  DELETE_TASK_CLASS,
  SPAN_TEXT_CLASS,
  TODO_DATE,
  TODO_ITEM_CLASS,
} from '../types'
import { checkOverdueTasks, getColorScheme } from '../utils/date'
import { deleteTasks, getTasks, saveTasks } from '../utils/storage'

const createConfigTimeDate = (task: Tasks): HTMLParagraphElement => {
  const dueDate = document.createElement('p')
  dueDate.classList.add(TODO_DATE)

  const time = document.createElement('time')
  const datenow = new Date()

  if (task.dueDate) {
    const dueDateObj = new Date(task.dueDate)
    const colorScheme = getColorScheme(task.dueDate, datenow)

    time.style.backgroundColor = colorScheme.bg
    time.style.color = colorScheme.color

    time.setAttribute('datetime', task.dueDate)
    time.textContent = dueDateObj.toLocaleDateString('de-CH')
  } else {
    time.textContent = 'no due date'
  }

  dueDate.appendChild(time)
  return dueDate
}

export const createTaskElement = (
  task: Tasks,
): {
  taskItem: HTMLLIElement
  checkbox: HTMLInputElement
  textSpan: HTMLSpanElement
  deleteButton: HTMLButtonElement
} => {
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

  const deleteButton = document.createElement('button')
  deleteButton.textContent = 'Remove'
  deleteButton.classList.add(DELETE_TASK_CLASS)

  const dueDateElement = createConfigTimeDate(task)

  taskItem.append(checkbox, textSpan, deleteButton, dueDateElement)

  return { taskItem, checkbox, textSpan, deleteButton }
}

export const updateTaskState = async (
  task: Tasks,
  completed: boolean,
  storage: Storage = localStorage,
): Promise<void> => {
  task.completed = completed

  const tasks = await getTasks(storage)
  const taskToUpdate = tasks.find((t) => t.id === task.id)

  if (taskToUpdate) {
    taskToUpdate.completed = completed
  }

  await saveTasks(tasks, storage)
}

const removeOverdueMessage = (taskId: string) => {
  const container = document.querySelector(`[data-taskid="${taskId}"]`)
  if (!container) {
    throw new Error('No container found')
  }
  container.remove()
}

export const attachTaskEventListeners = (
  elements: {
    taskItem: HTMLLIElement
    checkbox: HTMLInputElement
    deleteButton: HTMLButtonElement
  },
  task: Tasks,
): void => {
  const { taskItem, checkbox, deleteButton } = elements
  checkOverdueTasks(task.dueDate, new Date(), task.id)
  checkbox.addEventListener('change', async () => {
    const isCompleted = checkbox.checked

    if (isCompleted) {
      taskItem.classList.add('completed')
      removeOverdueMessage(task.id)
    } else {
      taskItem.classList.remove('completed')
    }

    await updateTaskState(task, isCompleted)
  })

  deleteButton.addEventListener('click', async () => {
    await deleteTasks(task.id, localStorage)
    taskItem.remove()
    removeOverdueMessage(task.id)
  })
}
