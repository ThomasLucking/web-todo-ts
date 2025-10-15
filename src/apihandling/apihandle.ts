import type { Tasks } from '../types'

const API_URL = 'https://api.todos.in.jt-lab.ch/todos'

interface ApiTask {
  id: number
  title: string
  content: string | null
  due_date: string | null
  done: boolean
}

function mapApiTask(task: ApiTask): Tasks {
  return {
    id: task.id.toString(),
    text: task.title,
    completed: task.done,
    dueDate: task.due_date ?? '',
  }
}

export const saveTasksViaAPI = async (task: Tasks): Promise<void> => {
  try {
    const payload = {
      title: task.text,
      content: null,
      due_date: task.dueDate || null,
      done: task.completed,
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
      alert('Error with the API: ' + response.status)
    }
  } catch (error) {
    console.error('Failed to save task:', error)
  }
}

export const fetchTasks = async (): Promise<Tasks[]> => {
  try {
    const response = await fetch(API_URL, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    })
    if (!response.ok) {
      alert('Error with the API: ' + response.status)
    }
    const data: ApiTask[] = await response.json()
    return data.map(mapApiTask)
  } catch (_error) {
    console.error(_error)
    throw new Error('cannot load tasks')
  }
}

export const deleteTasksViaAPI = async (taskId: string): Promise<void> => {
  try {
    const response = await fetch(`${API_URL}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    })

    if (!response.ok) {
      alert('Error with the API: ' + response.status)
    }
    return response.json()
  } catch (_error) {
    console.error(_error)
    throw new Error('cannot delete task')
  }
}
