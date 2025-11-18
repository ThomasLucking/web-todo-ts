// taskelements in the original file.

import type { AssociateCatgoriesAPI } from '../AssociateCategories/AssociateAPI'
import type { CategoryAPI } from '../CategoryApiHandling/CategoryAPI'
import type { SavedApiTask, TaskAPI } from '../TaskApiHandling/TaskAPI'
import {
  CHECKBOX_ITEM_CLASS,
  DELETE_TASK_CLASS,
  SPAN_TEXT_CLASS,
  TODO_DATE,
  TODO_ITEM_CLASS,
} from '../types/index'
import { checkOverdueTasks, getColorScheme } from '../utils/date'

export class Task {
  private data: SavedApiTask
  private api: TaskAPI
  private categorys: CategoryAPI
  private taskItem!: HTMLLIElement
  private checkbox!: HTMLInputElement
  private deleteButton!: HTMLButtonElement
  private textSpan!: HTMLSpanElement
  private categoryname!: HTMLSpanElement
  private associateApi: AssociateCatgoriesAPI

  constructor(
    data: SavedApiTask,
    api: TaskAPI,
    categorys: CategoryAPI,
    associateApi: AssociateCatgoriesAPI,
  ) {
    this.data = data
    this.api = api
    this.categorys = categorys
    this.associateApi = associateApi
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

  async render(): Promise<string | Node> {
    this.taskItem = document.createElement('li')
    this.taskItem.classList.add(TODO_ITEM_CLASS)

    this.checkbox = document.createElement('input')
    this.checkbox.type = 'checkbox'
    this.checkbox.classList.add(CHECKBOX_ITEM_CLASS)

    this.textSpan = document.createElement('span')
    this.textSpan.textContent = this.data.title
    this.textSpan.classList.add(SPAN_TEXT_CLASS)

    this.categoryname = document.createElement('span')
    this.categoryname.textContent = 'no category.'
    this.categoryname.classList.add('category-text')

    this.deleteButton = document.createElement('button')
    this.deleteButton.textContent = 'Remove'
    this.deleteButton.classList.add(DELETE_TASK_CLASS)

    const dueDateElement = this.createConfigTimeDate()
    this.checkbox.checked = this.data.done
    const categoryId = await this.associateApi.getCategoryIdByTodoId(
      this.data.id,
    )

    if (categoryId !== null) {
      const categories = await this.categorys.fetchCategories()

      const taskCategory = categories.find(
        (category) => category.id === categoryId,
      )

      if (taskCategory) {
        this.taskItem.style.border = `2px solid ${taskCategory.color}`
        this.categoryname.textContent = taskCategory.title
      }
    }
    if (this.data.done) {
      this.taskItem.classList.add('completed')
    }
    this.taskItem.append(
      this.checkbox,
      this.textSpan,
      this.deleteButton,
      this.categoryname,
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
    if (this.data.due_date) {
      checkOverdueTasks(this.data.due_date, new Date(), this.data.id)
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
