// API handling file original
import { BaseAPI } from '../utils/Baseapi'
export interface ApiCategory {
  title: string
  color: string
}

export type SavedCategoryAPI = ApiCategory & { id: number }

export class CategoryAPI extends BaseAPI {
  private API_URL = 'https://api.todos.in.jt-lab.ch/categories'

  protected duration_timer = document.querySelector<HTMLDivElement>(
    '.durationCategories',
  )

  saveCategoriesViaAPI = async (
    category: ApiCategory,
  ): Promise<SavedCategoryAPI> => {
    const payload = {
      title: category.title,
      color: category.color,
    }

    const data = await this.request(
      this.API_URL,
      'POST',
      {
        loading: '...loading',
        success: 'Categories successfully saved.',
        error: 'Failed to Category ',
      },
      {
        'Content-Type': 'application/json',
        Prefer: 'return=representation',
      },
      payload,
    )
    if (!data || !data[0]) {
      throw new Error('API did not return the saved category.')
    }

    return data[0] as SavedCategoryAPI
  }
  async fetchCategories(): Promise<SavedCategoryAPI[]> {
    const data = await this.request(this.API_URL, 'GET', {
      loading: 'Loading tasks...',
      success: 'Categories successfully loaded!',
      error: 'Failed to load Categories',
    })
    return data as SavedCategoryAPI[]
  }
  async deleteCategoriesViaAPI(taskId: number): Promise<void> {
    await this.request(`${this.API_URL}?id=eq.${taskId}`, 'DELETE', {
      loading: 'Attempting to delete task...',
      success: 'Task successfully deleted',
      error: 'Failed to delete task',
    })
  }
  async updateCategoryViaAPI(
    category: SavedCategoryAPI,
  ): Promise<SavedCategoryAPI> {
    const payload = {
      title: category.title,
      color: category.color,
    }

    const data = await this.request(
      `${this.API_URL}?id=eq.${category.id}`,
      'PATCH',
      {
        loading: 'Updating category...',
        success: 'Category successfully updated.',
        error: 'Failed to update category',
      },
      {
        'Content-Type': 'application/json',
        Prefer: 'return=representation',
      },
      payload,
    )

    return data[0] as SavedCategoryAPI
  }
}
