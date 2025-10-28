// API handling file original

export interface ApiTask {
  title: string
  content: string
  due_date: string | null
  done: boolean
}

export type SavedApiTask = ApiTask & { id: number }

export class TaskAPI {
  private API_URL = 'https://api.todos.in.jt-lab.ch/todos'
  private duration_timer = document.querySelector<HTMLDivElement>('.duration')

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
    return data
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
