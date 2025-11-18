// API handling file original
import { BaseAPI } from '../utils/Baseapi'
// import { CategoryAPI, SavedCategoryAPI } from '../CategoryApiHandling/CategoryAPI'
export interface ApiTask {
  title: string
  content: string
  due_date: string | null
  done: boolean
}

export type SavedApiTask = ApiTask & { id: number }

export class TaskAPI extends BaseAPI {
  private API_URL =
    'https://api.todos.in.jt-lab.ch/todos'
  protected duration_timer = document.querySelector<HTMLDivElement>('.duration')

  saveTasksViaAPI = async (task: ApiTask): Promise<SavedApiTask> => {
    const payload = {
      title: task.title,
      content: task.content,
      due_date: task.due_date || null,
      done: task.done,
    }

    const data = await this.request(
      this.API_URL,
      'POST',
      {
        loading: '...loading',
        success: 'Task successfully saved.',
        error: 'Failed to save task',
      },
      {
        'Content-Type': 'application/json',
        Prefer: 'return=representation',
      },
      payload,
    )

    return data[0] as SavedApiTask
  }
  async fetchTasks(): Promise<SavedApiTask[]> {
    const data = await this.request(this.API_URL, 'GET', {
      loading: 'Loading tasks...',
      success: 'Tasks successfully loaded!',
      error: 'Failed to load tasks',
    })
    return data as SavedApiTask[]
  }
  async deleteTasksViaAPI(taskId: number): Promise<void> {
    await this.request(`${this.API_URL}?id=eq.${taskId}`, 'DELETE', {
      loading: 'Attempting to delete task...',
      success: 'Task successfully deleted',
      error: 'Failed to delete task',
    })
  }
  async updateTaskStateViaAPI(
    task: SavedApiTask,
    done: boolean,
  ): Promise<SavedApiTask> {
    const data = await this.request(
      `${this.API_URL}?id=eq.${task.id}`,
      'PATCH',
      {
        loading: 'Attempting to update state of task...',
        success: 'Updated State of task successfully',
        error: 'Failed to update task state',
      },
      undefined, // use default headers
      { done },
    )
    return data[0] as SavedApiTask
  }
  async deleteAllTasksViaAPI(): Promise<void> {
    await this.request(this.API_URL, 'DELETE', {
      loading: 'Attempting to delete tasks...',
      success: 'All tasks Succesfully deleted',
      error: 'Failed to delete tasks',
    })
  }
}
