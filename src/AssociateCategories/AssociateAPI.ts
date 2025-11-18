import { BaseAPI } from '../utils/Baseapi'

export interface IdCategory {
  category_id: number
  todo_id: number
}

export class AssociateCatgoriesAPI extends BaseAPI {
  private API_URL = 'https://api.todos.in.jt-lab.ch/categories_todos'

  SaveAssociationIdAPI = async (
    todoId: number,
    categoryId: number,
  ): Promise<void> => {
    if (!categoryId) {
      throw new Error('Invalid category ID')
    }

    const payload = {
      category_id: categoryId,
      todo_id: todoId,
    }

    await this.request(
      this.API_URL,
      'POST',
      {
        loading: '...loading',
        success: 'Successfully saved association',
        error: 'Failed to save association',
      },
      {
        'Content-Type': 'application/json',
        Prefer: 'return=representation',
      },
      payload,
    )
  }

  async getCategoryIdByTodoId(todoId: number): Promise<number | null> {
    const data: Array<{ category_id: number; todo_id: number }> =
      await this.request(
        `${this.API_URL}?todo_id=eq.${todoId}`,
        'GET',
        {
          loading: '...loading',
          success: 'Successfully fetched association',
          error: 'Failed to load association',
        },
        {
          'Content-Type': 'application/json',
          Prefer: 'return=representation',
        },
      )

    if (data.length > 0) {
      return data[0].category_id
    }
    return null
  }
}
