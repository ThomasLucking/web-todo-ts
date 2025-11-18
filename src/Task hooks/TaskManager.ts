import { AssociateCatgoriesAPI } from '../AssociateCategories/AssociateAPI'
import type { CategoryAPI } from '../CategoryApiHandling/CategoryAPI'
import { clearError, showError } from '../Task components/errorHandler'
import { Task } from '../Task components/Tasks'
import type { ApiTask, SavedApiTask, TaskAPI } from '../TaskApiHandling/TaskAPI'
import { PreventTaskCreation } from '../utils/date'
export class TaskManager {
  private api: TaskAPI
  private tasks: Task[] = []
  private categoryapi: AssociateCatgoriesAPI
  private categorys: CategoryAPI
  private addTaskButton!: HTMLButtonElement
  private inputValue!: HTMLInputElement
  private taskCreatedSection!: HTMLUListElement
  private errorMessage!: HTMLDivElement
  private deleteAllbutton!: HTMLButtonElement
  private todoDates!: HTMLInputElement
  private categorySelectInput!: HTMLSelectElement

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

  constructor(
    api: TaskAPI,
    categoryapi: AssociateCatgoriesAPI,
    categorys: CategoryAPI,
  ) {
    this.api = api
    this.categoryapi = categoryapi
    this.categorys = categorys
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
    const categorySelectInput =
      document.querySelector<HTMLSelectElement>('.category-select')

    if (
      !addTaskButton ||
      !inputValue ||
      !taskCreatedSection ||
      !deleteAllbutton ||
      !errorMessage ||
      !todoDates ||
      !categorySelectInput
    ) {
      throw new Error('One or more required elements do not exist')
    }

    this.addTaskButton = addTaskButton
    this.inputValue = inputValue
    this.taskCreatedSection = taskCreatedSection
    this.deleteAllbutton = deleteAllbutton
    this.errorMessage = errorMessage
    this.todoDates = todoDates
    this.categorySelectInput = categorySelectInput

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

  public async createTask(): Promise<SavedApiTask> {
    const value = this.inputValue.value.trim()

    try {
      PreventTaskCreation(this.todoDates.value, new Date())
    } catch (error) {
      console.error(error)
      throw error
    }

    if (!value) {
      showError('Please enter a task', this.errorMessage)
      throw new Error('Task title is required')
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

    // The fix prevents tasks from being associated with all categories, ensuring they display one color or no color based on the user's choice.
    const selectedCategoryIdString = this.categorySelectInput.value
    const selectedCategoryId = Number.parseInt(selectedCategoryIdString, 10)
    const isValidCategorySelected =
      !Number.isNaN(selectedCategoryId) && selectedCategoryId > 0

    const savedTask = await this.api.saveTasksViaAPI(newTask)

    if (isValidCategorySelected) {
      await this.categoryapi.SaveAssociationIdAPI(
        savedTask.id,
        selectedCategoryId,
      )
    }

    this.renderTask(savedTask)

    return savedTask
  }

  private async renderTask(task: SavedApiTask): Promise<void> {
    const taskInstance = new Task(
      task,
      this.api,
      this.categorys,
      this.categoryapi,
    )
    const taskElement = await taskInstance.render()
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
