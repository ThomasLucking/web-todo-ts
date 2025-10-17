const API_URL = 'https://api.todos.in.jt-lab.ch/todos'
const duration_timer = document.querySelector<HTMLDivElement>('.duration')
export interface ApiTask {
  title: string
  content: string
  due_date: string | null
  done: boolean
}

export type SavedApiTask = ApiTask & { id: number }

export const saveTasksViaAPI = async (task: ApiTask): Promise<SavedApiTask> => {
  try {
    const payload = {
      title: task.title,
      content: task.content,
      due_date: task.due_date || null,
      done: task.done,
    }

    if (!duration_timer) {
      throw new Error('Duration timer element not found')
    }
    duration_timer.textContent = '...loading'

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
    if (response.status === 201) {
      duration_timer.textContent = 'Task Sucessfully saved!'
      setTimeout(() => {
        if (duration_timer) {
          duration_timer.textContent = ''
        }
      }, 1500)
    }

    const data = await response.json()
    return data[0] as SavedApiTask
  } catch (error) {
    console.error('Failed to save task:', error)
    throw new Error('Failed to save task')
  }
}

export const fetchTasks = async (): Promise<SavedApiTask[]> => {
  try {
    if (!duration_timer) {
      throw new Error('Duration timer element not found')
    }
    duration_timer.textContent = 'Loading tasks...'
    const response = await fetch(API_URL, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    })
    if (!response.ok) {
      throw new Error('Failed to fetch tasks')
    }
    const data: SavedApiTask[] = await response.json()

    duration_timer.textContent = 'Tasks successfully loaded!'
    setTimeout(() => {
      if (duration_timer) duration_timer.textContent = ''
    }, 1500)
    return data
  } catch (error) {
    console.error(error)
    if (duration_timer) {
      duration_timer.textContent = 'Failed to load tasks.'
      setTimeout(() => {
        if (duration_timer) duration_timer.textContent = ''
      }, 3000)
    }

    throw new Error('Cannot load tasks')
  }
}

export const deleteTasksViaAPI = async (taskId: number): Promise<void> => {
  try {
    if (!duration_timer) {
      throw new Error('Duration timer element not found')
    }
    duration_timer.textContent = 'Attempting to delete task...'

    const response = await fetch(`${API_URL}?id=eq.${taskId}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    })
    if (!response.ok) {
      alert(`Error with the API:${response.status}`)
    }
    if (response.status === 204) {
      console.log('Post succesfully deleted')
    }

    duration_timer.textContent = 'Tasks successfully deleted'
    setTimeout(() => {
      if (duration_timer) duration_timer.textContent = ''
    }, 1500)

    console.log(response)
    return
  } catch (_error) {
    if (duration_timer) {
      duration_timer.textContent = 'Failed to load tasks.'
      setTimeout(() => {
        if (duration_timer) duration_timer.textContent = ''
      }, 3000)
    }
    throw new Error('cannot delete task')
  }
}

export const deleteAllTasksViaAPI = async (): Promise<void> => {
  try {
    if (!duration_timer) {
      throw new Error('Duration timer element not found')
    }
    duration_timer.textContent = 'Attempting to delete all tasks...'

    const response = await fetch(API_URL, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    })
    if (!response.ok) {
      alert(`Error with the API:${response.status}`)
    }
    if (response.status === 204) {
      console.log('Post succesfully deleted')
    }
    duration_timer.textContent = 'Tasks successfully deleted'
    setTimeout(() => {
      if (duration_timer) duration_timer.textContent = ''
    }, 1500)

    console.log(response)
    return
  } catch (_error) {
    if (duration_timer) {
      duration_timer.textContent = 'Failed to load tasks.'
      setTimeout(() => {
        if (duration_timer) duration_timer.textContent = ''
      }, 3000)
    }
    throw new Error('cannot delete task')
  }
}

export const updateTaskStateViaAPI = async (
  task: SavedApiTask,
  done: boolean,
): Promise<SavedApiTask> => {
  try {
    if (!duration_timer) {
      throw new Error('Duration timer element not found')
    }
    duration_timer.textContent = 'Attempting to update state of task...'

    const response = await fetch(`${API_URL}?id=eq.${task.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Prefer: 'return=representation',
      },
      body: JSON.stringify({ done }),
    })

    if (!response.ok) {
      throw new Error(`Failed to update task state: ${response.status}`)
    }
    duration_timer.textContent = 'Updated State of task successfully'
    setTimeout(() => {
      if (duration_timer) duration_timer.textContent = ''
    }, 1500)

    const data = await response.json()
    return data[0] as SavedApiTask
  } catch (_error) {
    if (duration_timer) {
      duration_timer.textContent = 'Failed to update task state'
      setTimeout(() => {
        if (duration_timer) duration_timer.textContent = ''
      }, 3000)
    }
    throw new Error('cannot delete task')
  }
}
