import type {
  CategoryAPI,
  SavedCategoryAPI,
} from '../CategoryApiHandling/CategoryAPI'
import {
  CATEGORY_DELETE_CLASS,
  CATEGORY_ITEM_CLASS,
  DEFAULT_COLOR,
  EDITED_CATEGORY_ITEM_CLASS,
  SPAN_CATEGORY_TEXT,
} from '../types/index'

class Category {
  public data: SavedCategoryAPI
  public api: CategoryAPI
  private categoryItem!: HTMLLIElement
  private deleteButton!: HTMLButtonElement
  private textSpan!: HTMLSpanElement

  constructor(data: SavedCategoryAPI, api: CategoryAPI) {
    this.data = data
    this.api = api
  }

  render(): HTMLLIElement {
    this.categoryItem = document.createElement('li')
    this.categoryItem.classList.add(CATEGORY_ITEM_CLASS)

    this.textSpan = document.createElement('span')
    this.textSpan.textContent = this.data.title
    this.textSpan.classList.add(SPAN_CATEGORY_TEXT)
    this.textSpan.style.backgroundColor = this.data.color || DEFAULT_COLOR

    this.deleteButton = document.createElement('button')
    this.deleteButton.textContent = 'Remove'
    this.deleteButton.classList.add(CATEGORY_DELETE_CLASS)

    this.categoryItem.append(this.textSpan, this.deleteButton)
    this.attachEvents()

    return this.categoryItem
  }

  private attachEvents(): void {
    this.deleteButton.addEventListener('click', async () => {
      try {
        await this.api.deleteCategoriesViaAPI(this.data.id)
        this.categoryItem.remove()
      } catch (error) {
        console.error('Error deleting category:', error)
      }
    })
  }
}

class EditCategory extends Category {
  private titleInput!: HTMLInputElement
  private colorInput!: HTMLInputElement
  private ItemContainer!: HTMLLIElement

  render(): HTMLLIElement {
    this.ItemContainer = document.createElement('li')
    this.ItemContainer.classList.add(EDITED_CATEGORY_ITEM_CLASS)

    this.titleInput = document.createElement('input')
    this.titleInput.type = 'text'
    this.titleInput.value = this.data.title

    this.colorInput = document.createElement('input')
    this.colorInput.type = 'color'
    this.colorInput.value = this.data.color

    this.ItemContainer.append(this.titleInput, this.colorInput)

    let titleEdited = false
    let colorEdited = false

    // this function is used to re attach the event listener to the category after exiting edit mode.
    // the fn parameter is used to perform logic after the category is rendered
    const updatedCategory = (fn?: (updatedElement: HTMLLIElement) => void) => {
      const updatedCategoryInstance = new Category(this.data, this.api)
      const updatedElement = updatedCategoryInstance.render()

      this.ItemContainer.replaceWith(updatedElement)

      updatedElement.addEventListener('click', (event) => {
        if (
          (event.target as HTMLElement).classList.contains(
            CATEGORY_DELETE_CLASS,
          )
        )
          return

        const editable = new EditCategory(this.data, this.api)
        const editElement = editable.render()
        updatedElement.replaceWith(editElement)
      })

      if (fn) fn(updatedElement)
    }

    const saveChanges = async () => {
      if (!titleEdited || !colorEdited) return
      const newTitle = this.titleInput.value
      const newColor = this.colorInput.value

      if (newTitle !== this.data.title || newColor !== this.data.color) {
        this.data.title = newTitle
        this.data.color = newColor
        await this.api.updateCategoryViaAPI(this.data)
      }

      updatedCategory()
    }

    this.titleInput.addEventListener('blur', () => {
      titleEdited = true
      saveChanges()
    })
    this.colorInput.addEventListener('change', () => {
      colorEdited = true
      saveChanges()
    })

    return this.ItemContainer
  }
}

export { Category, EditCategory }
