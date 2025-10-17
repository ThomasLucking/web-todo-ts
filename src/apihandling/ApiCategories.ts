const API_URL = 'https://api.todos.in.jt-lab.ch/categories_todos'


export interface ApiCategory {
  title: string
  color: string

}

export type SavedApiCategory = ApiCategory & { id: number }

export const saveCategoriesViaAPI = async (category: ApiCategory): Promise<SavedApiCategory> => {
  try {
    const payload = {
      title: category.title,
      color: category.color,
    }

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Prefer: 'return=representation',
      },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      throw new Error(`Error with the API: ${response.status}`)
    }
    const data = await response.json()
    return data[0] as SavedApiCategory
  } catch (error) {
    console.error('Failed to save task:', error)
    throw new Error('Failed to save task')
  }
}


