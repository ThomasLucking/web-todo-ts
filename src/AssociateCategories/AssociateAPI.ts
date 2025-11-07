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

  GetAssociationIDs = async (): Promise<number[]> => {
    const data: Array<{ category_id: number; todo_id: number }> =
      await this.request(
        this.API_URL,
        'GET',
        {
          loading: '...loading',
          success: 'Successfully fetched associations',
          error: 'Failed to load tasks',
        },
        {
          'Content-Type': 'application/json',
          Prefer: 'return=representation',
        },
      )

    const todoIds = data.map((item) => item.todo_id)
    return todoIds
  }

  async whatever2API(taskId: number): Promise<void> {
    await this.request(`${this.API_URL}?id=eq.${taskId}`, 'DELETE', {
      loading: 'Attempting to delete task...',
      success: 'Task successfully deleted',
      error: 'Failed to delete task',
    })
  }
}
