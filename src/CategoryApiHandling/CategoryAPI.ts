// API handling file original

export interface ApiCategory {
  title: string
  color: string
}

export type SavedCategoryAPI = ApiCategory & { id: number }

export class CategoryAPI {
  private API_URL = 'https://api.todos.in.jt-lab.ch/categories'
  private duration_timer = document.querySelector<HTMLDivElement>(
    '.durationCategories',
  )

  private updateDurationTimer(message: string, duration?: number) {
    if (!this.duration_timer) {
      throw new Error('Duration timer element not found')
    }
    this.duration_timer.textContent = message
    if (duration) {
      setTimeout(() => {
        if (this.duration_timer) {
          this.duration_timer.textContent = ''
        }
      }, duration)
    }
  }
  private async request(
    url: string,
    method: string,
    messages: { loading: string; success: string; error: string },
    headers?: Record<string, string>, // this is to store keys and values as strings of any type of data.
    // Example: { "Content-Type": "application/json", "Authorization": "Bearer xyz" }
    body?: any,
  ): Promise<any> {
    try {
      this.updateDurationTimer(messages.loading)

      const response = await fetch(url, {
        method: method,
        headers: headers || {
          'Content-Type': 'application/json',
          Prefer: 'return=representation',
        },
        body: body ? JSON.stringify(body) : undefined,
      })

      if (!response.ok) {
        throw new Error(`Error with the API: ${response.status}`)
      }

      this.updateDurationTimer(messages.success, 1500)

      const data = await response.json()
      return data
    } catch (error) {
      this.updateDurationTimer(messages.error, 3000)
      console.error(error)
      throw error
    }
  }
  saveCategoriesViaAPI = async (
    Category: ApiCategory,
  ): Promise<SavedCategoryAPI> => {
    const payload = {
      title: Category.title,
      color: Category.color,
    }

    const data = await this.request(
      this.API_URL,
      'POST',
      {
        loading: '...loading',
        success: 'Categories successfully saved.',
        error: 'Failed to Category task',
      },
      {
        'Content-Type': 'application/json',
        Prefer: 'return=representation',
      },
      payload,
    )

    return data[0] as SavedCategoryAPI
  }
  async fetchTasks(): Promise<SavedCategoryAPI[]> {
    const data = await this.request(this.API_URL, 'GET', {
      loading: 'Loading tasks...',
      success: 'Categories successfully loaded!',
      error: 'Failed to load Categorys',
    })
    return data
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
