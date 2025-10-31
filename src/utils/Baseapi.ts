// Protected instances and variables and functions for the base API class.
// request<T> is a generic type.
// abtract class is meant to be a like a blue print class that is could be used for extending to other classes and polyphism.

export abstract class BaseAPI {
  protected duration_timer = document.querySelector<HTMLDivElement>(
    '.durationCategories',
  )

  protected updateDurationTimer(message: string, duration?: number) {
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
  protected async request<T>(
    url: string,
    method: string,
    messages: { loading: string; success: string; error: string },
    headers?: Record<string, string>, // this is to store keys and values as strings of any type of data.
    // Example: { "Content-Type": "application/json", "Authorization": "Bearer xyz" }
    body?: unknown,
  ): Promise<T[]> {
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

      const data = (await response.json()) as T[]
      return data
    } catch (error) {
      this.updateDurationTimer(messages.error, 3000)
      console.error(error)
      throw error
    }
  }
}
