// Hooksevent handler in original

import { clearError, showError } from '../Task components/errorHandler'
import Task from '../Task components/Tasks'
import type { ApiTask, SavedApiTask, TaskAPI } from '../TaskApiHandling/TaskAPI'
import { PreventTaskCreation } from '../utils/date'

class TaskManager {
  private api: TaskAPI
  private tasks: Task[] = []

  private addTaskButton!: HTMLButtonElement
  private inputValue!: HTMLInputElement
  private taskCreatedSection!: HTMLUListElement
  private errorMessage!: HTMLDivElement
  private deleteAllbutton!: HTMLButtonElement
  private todoDates!: HTMLInputElement

  private validateDOMElements(): void {
    if (
      !this.addTaskButton ||
      !this.inputValue ||
      !this.taskCreatedSection ||
      !this.errorMessage ||
      !this.deleteAllbutton ||
      !this.todoDates
    ) {
      console.error('Missing a Dom element')
      throw new Error('Missing a DOM element. Aborting script.')
    }
  }

  constructor(api: TaskAPI) {
    this.api = api

    const addTaskButton =
      document.querySelector<HTMLButtonElement>('#add-todo-button')
    const inputValue = document.querySelector<HTMLInputElement>('#todo-input')
    const taskCreatedSection =
      document.querySelector<HTMLUListElement>('#todo-elements')
    const deleteAllbutton =
      document.querySelector<HTMLButtonElement>('#delete-all')
    const errorMessage =
      document.querySelector<HTMLDivElement>('#error-message')
    const todoDates =
      document.querySelector<HTMLInputElement>('#todo-date-input')

    if (
      !addTaskButton ||
      !inputValue ||
      !taskCreatedSection ||
      !deleteAllbutton ||
      !errorMessage ||
      !todoDates
    ) {
      throw new Error('One or more required elements do not exist')
    }

    this.addTaskButton = addTaskButton
    this.inputValue = inputValue
    this.taskCreatedSection = taskCreatedSection
    this.deleteAllbutton = deleteAllbutton
    this.errorMessage = errorMessage
    this.todoDates = todoDates

    this.validateDOMElements()
    this.initialize()
  }

  private initialize(): void {
    this.attachEventListeners()
    this.loadTasks()
  }

  private attachEventListeners(): void {
    this.addTaskButton.addEventListener('click', () => {
      this.createTask()
    })

    this.deleteAllbutton.addEventListener('click', () => {
      this.handleDeleteAll()
    })
    this.inputValue.addEventListener('keydown', (event: KeyboardEvent) => {
      if (event.key === 'Enter') {
        this.createTask()
      }
    })
  }

  private async createTask(): Promise<void> {
    const value = this.inputValue.value.trim()

    try {
      PreventTaskCreation(this.todoDates.value, new Date())
    } catch (error) {
      console.error(error)
      return
    }
    if (!value) {
      showError('Please enter a task', this.errorMessage)
      return
    }
    clearError(this.errorMessage)

    const newTask: ApiTask = {
      title: value,
      content: value,
      done: false,
      due_date: this.todoDates.value || null,
    }

    this.inputValue.value = ''
    this.todoDates.value = ''

    const savedTask = await this.api.saveTasksViaAPI(newTask)
    this.renderTask(savedTask)
  }
  private renderTask(task: SavedApiTask): void {
    const taskInstance = new Task(task, this.api)
    const taskElement = taskInstance.render()
    this.taskCreatedSection.append(taskElement)
    this.tasks.push(taskInstance)
  }

  private async handleDeleteAll(): Promise<void> {
    await this.api.deleteAllTasksViaAPI()
    this.taskCreatedSection.innerHTML = ''
    this.tasks = []
  }

  private async loadTasks(): Promise<void> {
    const tasks: SavedApiTask[] = await this.api.fetchTasks()

    tasks.forEach((task) => {
      this.renderTask(task)
    })
  }
}

export default TaskManager
