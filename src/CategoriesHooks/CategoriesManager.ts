// Fixed CategoryManager.ts

import { Category, EditCategory } from '../CategoriesComponents/Categories'
import type {
  ApiCategory,
  CategoryAPI,
  SavedCategoryAPI,
} from '../CategoryApiHandling/CategoryAPI'
import { clearError, showError } from '../Task components/errorHandler'
import { CATEGORY_DELETE_CLASS, DEFAULT_BLUE_COLOR } from '../types'

class CategoryManager {
  private api: CategoryAPI
  private categories: Category[] = []
  private addCategoryButton!: HTMLButtonElement
  private inputValue!: HTMLInputElement
  private colorInputValue!: HTMLInputElement
  private categoryListSection!: HTMLUListElement
  private errorMessage!: HTMLDivElement

  constructor(api: CategoryAPI) {
    this.api = api

    const addCategoryButton = document.querySelector<HTMLButtonElement>(
      '#create-category-button',
    )
    const inputValue = document.querySelector<HTMLInputElement>(
      '#category-name-input',
    )
    const colorInputValue = document.querySelector<HTMLInputElement>(
      '#categories-color-input',
    )
    const categoryListSection = document.querySelector<HTMLUListElement>(
      '#categories-elements',
    )
    const errorMessage =
      document.querySelector<HTMLDivElement>('#error-message')

    if (
      !addCategoryButton ||
      !inputValue ||
      !colorInputValue ||
      !categoryListSection ||
      !errorMessage
    ) {
      throw new Error('One or more required elements do not exist')
    }

    this.addCategoryButton = addCategoryButton
    this.inputValue = inputValue
    this.colorInputValue = colorInputValue
    this.colorInputValue.value = DEFAULT_BLUE_COLOR
    this.categoryListSection = categoryListSection
    this.errorMessage = errorMessage

    this.loadCategoriesIntoDropdown()
    this.initialize()
  }

  private async loadCategoriesIntoDropdown(): Promise<void> {
    const categorySelect =
      document.querySelector<HTMLSelectElement>('.category-select')
    if (!categorySelect) throw new Error('Dropdown element does not exist')

    const categories = await this.api.fetchCategories()

    categorySelect.innerHTML = ''

    const defaultOption = document.createElement('option')
    defaultOption.value = ''
    defaultOption.textContent = 'Select a category'
    categorySelect.appendChild(defaultOption)

    categories.forEach((category) => {
      const option = document.createElement('option')
      option.value = category.id.toString()
      option.textContent = category.title
      categorySelect.appendChild(option)
    })
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
      color: color || DEFAULT_BLUE_COLOR,
    }

    this.inputValue.value = ''
    this.colorInputValue.value = ''

    const savedCategory = await this.api.saveCategoriesViaAPI(newCategory)
    if (!savedCategory) {
      console.error('Category save failed, received undefined!')
      return
    }
    this.loadCategoriesIntoDropdown()
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
    const categories: SavedCategoryAPI[] = await this.api.fetchCategories()
    for (const category of categories) {
      this.renderCategory(category)
    }
  }
}

export default CategoryManager
