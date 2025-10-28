// taskelements in the original file.

import type { SavedApiTask, TaskAPI } from '../TaskApiHandling/TaskAPI'
import {
  CHECKBOX_ITEM_CLASS,
  DELETE_TASK_CLASS,
  SPAN_TEXT_CLASS,
  TODO_DATE,
  TODO_ITEM_CLASS,
} from '../types/index'
import { checkOverdueTasks, getColorScheme } from '../utils/date'

class Task {
  private data: SavedApiTask
  private api: TaskAPI
  private taskItem!: HTMLLIElement
  private checkbox!: HTMLInputElement
  private deleteButton!: HTMLButtonElement
  private textSpan!: HTMLSpanElement

  constructor(data: SavedApiTask, api: TaskAPI) {
    this.data = data
    this.api = api
  }

  private createConfigTimeDate(): HTMLParagraphElement {
    const dueDate = document.createElement('p')
    dueDate.classList.add(TODO_DATE)

    const time = document.createElement('time')
    const datenow = new Date()

    if (this.data.due_date) {
      const dueDateObj = new Date(this.data.due_date)
      const colorScheme = getColorScheme(this.data.due_date, datenow)

      time.style.backgroundColor = colorScheme.bg
      time.style.color = colorScheme.color

      time.setAttribute('datetime', this.data.due_date)
      time.textContent = dueDateObj.toLocaleDateString('de-CH')
    } else {
      time.textContent = 'no due date'
    }

    dueDate.appendChild(time)
    return dueDate
  }

  render(): HTMLLIElement {
    this.taskItem = document.createElement('li')
    this.taskItem.classList.add(TODO_ITEM_CLASS)

    this.checkbox = document.createElement('input')
    this.checkbox.type = 'checkbox'
    this.checkbox.classList.add(CHECKBOX_ITEM_CLASS)

    this.textSpan = document.createElement('span')
    this.textSpan.textContent = this.data.title
    this.textSpan.classList.add(SPAN_TEXT_CLASS)

    this.deleteButton = document.createElement('button')
    this.deleteButton.textContent = 'Remove'
    this.deleteButton.classList.add(DELETE_TASK_CLASS)

    const dueDateElement = this.createConfigTimeDate()
    this.checkbox.checked = this.data.done
    if (this.data.done) {
      this.taskItem.classList.add('completed')
    }
    this.taskItem.append(
      this.checkbox,
      this.textSpan,
      this.deleteButton,
      dueDateElement,
    )
    this.attachEvents()

    return this.taskItem
  }
  private removeOverdueMessage(): void {
    const container = document.querySelector(`[data-taskid="${this.data.id}"]`)
    if (!container) {
      return
    }
    container.remove()
  }
  private attachEvents(): void {
    if (!this.data.done) {
      checkOverdueTasks(this.data.due_date ?? '', new Date(), this.data.id)
    }
    this.checkbox.addEventListener('change', async () => {
      const isCompleted = this.checkbox.checked

      if (isCompleted) {
        this.taskItem.classList.add('completed')
        this.removeOverdueMessage()
      } else {
        this.taskItem.classList.remove('completed')
      }

      await this.api.updateTaskStateViaAPI(this.data, isCompleted)
    })

    this.deleteButton.addEventListener('click', async () => {
      await this.api.deleteTasksViaAPI(this.data.id)
      this.taskItem.remove()
      this.removeOverdueMessage()
    })
  }
}

export default Task
