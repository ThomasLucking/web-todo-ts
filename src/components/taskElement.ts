// import type { Tasks } from '../types'
import type { SavedApiTask } from '../apihandling/apihandle'
import {
  deleteTasksViaAPI,
  saveTasksViaAPI,
  updateTaskStateViaAPI,
} from '../apihandling/apihandle'

import {
  CHECKBOX_ITEM_CLASS,
  DELETE_TASK_CLASS,
  SPAN_TEXT_CLASS,
  TODO_DATE,
  TODO_ITEM_CLASS,
} from '../types'
import { checkOverdueTasks, getColorScheme } from '../utils/date'

// import { deleteTasks } from '../utils/storage'

const createConfigTimeDate = (task: SavedApiTask): HTMLParagraphElement => {
  const dueDate = document.createElement('p')
  dueDate.classList.add(TODO_DATE)

  const time = document.createElement('time')
  const datenow = new Date()

  if (task.due_date) {
    const dueDateObj = new Date(task.due_date)
    const colorScheme = getColorScheme(task.due_date, datenow)

    time.style.backgroundColor = colorScheme.bg
    time.style.color = colorScheme.color

    time.setAttribute('datetime', task.due_date)
    time.textContent = dueDateObj.toLocaleDateString('de-CH')
  } else {
    time.textContent = 'no due date'
  }

  dueDate.appendChild(time)
  return dueDate
}

export const createTaskElement = (
  task: SavedApiTask,
): {
  taskItem: HTMLLIElement
  checkbox: HTMLInputElement
  textSpan: HTMLSpanElement
  deleteButton: HTMLButtonElement
} => {
  const taskItem = document.createElement('li')
  taskItem.classList.add(TODO_ITEM_CLASS)
  if (task.done) {
    taskItem.classList.add('completed')
  }

  const checkbox = document.createElement('input')
  checkbox.type = 'checkbox'
  checkbox.checked = task.done
  checkbox.classList.add(CHECKBOX_ITEM_CLASS)

  const textSpan = document.createElement('span')
  textSpan.textContent = task.title
  textSpan.classList.add(SPAN_TEXT_CLASS)

  const deleteButton = document.createElement('button')
  deleteButton.textContent = 'Remove'
  deleteButton.classList.add(DELETE_TASK_CLASS)

  const dueDateElement = createConfigTimeDate(task)

  taskItem.append(checkbox, textSpan, deleteButton, dueDateElement)

  return { taskItem, checkbox, textSpan, deleteButton }
}

export const updateTaskState = async (
  task: SavedApiTask,
  completed: boolean,
): Promise<void> => {
  task.done = completed
  await saveTasksViaAPI(task)
}

const removeOverdueMessage = (taskId: number) => {
  const container = document.querySelector(`[data-taskid="${taskId}"]`)
  if (!container) {
    return
  }
  container.remove()
}

export const attachTaskEventListeners = (
  elements: {
    taskItem: HTMLLIElement
    checkbox: HTMLInputElement
    deleteButton: HTMLButtonElement
  },
  task: SavedApiTask,
): void => {
  const { taskItem, checkbox, deleteButton } = elements
  // check if  only checked tasks for incomplete tasks.
  if (!task.done) {
    checkOverdueTasks(task.due_date ?? '', new Date(), task.id)
  }
  checkbox.addEventListener('change', async () => {
    const isCompleted = checkbox.checked

    if (isCompleted) {
      taskItem.classList.add('completed')
      removeOverdueMessage(task.id)
    } else {
      taskItem.classList.remove('completed')
    }

    await updateTaskStateViaAPI(task, isCompleted)
  })

  deleteButton.addEventListener('click', async () => {
    await deleteTasksViaAPI(task.id)
    taskItem.remove()
    removeOverdueMessage(task.id)
  })
}
