// Fixed CategoryManager.ts

import { Category, EditCategory } from '../CategoriesComponents/Categories'
import type {
  ApiCategory,
  CategoryAPI,
  SavedCategoryAPI,
} from '../CategoryApiHandling/CategoryAPI'
import { clearError, showError } from '../Task components/errorHandler'
import { CATEGORY_DELETE_CLASS } from '../types'

class CategoryManager {
  private api: CategoryAPI
  private categories: Category[] = []

  private addCategoryButton!: HTMLButtonElement
  private inputValue!: HTMLInputElement
  private colorInputValue!: HTMLInputElement
  private categoryListSection!: HTMLUListElement
  private errorMessage!: HTMLDivElement

  private validateDOMElements(): void {
    if (
      !this.addCategoryButton ||
      !this.inputValue ||
      !this.colorInputValue ||
      !this.categoryListSection ||
      !this.errorMessage
    ) {
      console.error('Missing a DOM element')
      throw new Error('Missing a DOM element. Aborting script.')
    }
  }

  constructor(api: CategoryAPI) {
    this.api = api

    this.addCategoryButton = document.querySelector<HTMLButtonElement>(
      '#create-category-button',
    )!
    this.inputValue = document.querySelector<HTMLInputElement>(
      '#category-name-input',
    )!
    this.colorInputValue =
      document.querySelector<HTMLInputElement>('#categories-color')!
    this.colorInputValue.value = '#0000ff'

    this.categoryListSection =
      document.querySelector<HTMLUListElement>('#category-items')!
    this.errorMessage =
      document.querySelector<HTMLDivElement>('#error-message')!

    this.validateDOMElements()
    this.initialize()
  }

  private initialize(): void {
    this.attachEventListeners()
    this.loadCategories()
  }

  private attachEventListeners(): void {
    this.addCategoryButton.addEventListener('click', () =>
      this.createCategory(),
    )
    this.inputValue.addEventListener('keydown', (event: KeyboardEvent) => {
      if (event.key === 'Enter') this.createCategory()
    })
  }

  private async createCategory(): Promise<void> {
    const name = this.inputValue.value.trim()
    const color = this.colorInputValue.value

    if (!name) {
      showError('Please enter a category name', this.errorMessage)
      return
    }

    clearError(this.errorMessage)

    const newCategory: ApiCategory = {
      title: name,
      color: color || '#cccccc',
    }

    this.inputValue.value = ''
    this.colorInputValue.value = ''

    const savedCategory = await this.api.saveCategoriesViaAPI(newCategory)
    this.renderCategory(savedCategory)
  }

  private renderCategory(category: SavedCategoryAPI): void {
    const categoryInstance = new Category(category, this.api)
    const categoryElement = categoryInstance.render()
    this.categoryListSection.append(categoryElement)

    categoryElement.addEventListener('click', (event) => {
      if (
        (event.target as HTMLElement).classList.contains(CATEGORY_DELETE_CLASS)
      ) {
        return
      }
      const editable = new EditCategory(category, this.api)
      const editElement = editable.render()
      categoryElement.replaceWith(editElement)
    })

    this.categories.push(categoryInstance)
  }

  private async loadCategories(): Promise<void> {
    const categories: SavedCategoryAPI[] = await this.api.fetchTasks()
    categories.forEach((category) => this.renderCategory(category))
  }
}

export default CategoryManager
