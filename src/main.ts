import './assets/style.css'
import { AssociateCatgoriesAPI } from '../src/AssociateCategories/AssociateAPI'
import { TaskManager } from '../src/Task hooks/TaskManager'
import CategoryManager from './CategoriesHooks/CategoriesManager'
import { CategoryAPI } from './CategoryApiHandling/CategoryAPI'
import { TaskAPI } from './TaskApiHandling/TaskAPI'

import { DARK_MODE_TOGGLE } from './types/index'

const themeToggle = document.querySelector<HTMLButtonElement>(
  `.${DARK_MODE_TOGGLE}`,
)
// or HTMLInputElement
const themePreferenceKey = 'themePreference'
const main_body = document.body

if (!main_body) {
  throw new Error("Element doesn't exist.")
}

const taskAPI = new TaskAPI()
const categoryAPI = new AssociateCatgoriesAPI()
const categoriesAPI = new CategoryAPI()

new CategoryManager(categoriesAPI)
new TaskManager(taskAPI, categoryAPI, categoriesAPI)

if (themeToggle) {
  const applyTheme = (theme: 'light' | 'dark') => {
    main_body.className = `${theme}-mode`
    localStorage.setItem(themePreferenceKey, theme)
    themeToggle.textContent = `Toggle ${theme === 'dark' ? 'Light' : 'Dark'} Mode`
  }

  // window.matchMedia evaluates a media query and returns an object
  // that tells you whether the query currently matches..
  const savedTheme = localStorage.getItem(themePreferenceKey) as
    | 'light'
    | 'dark'
    | null
  const initialTheme =
    savedTheme ||
    (window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light')

  applyTheme(initialTheme)

  themeToggle.addEventListener('click', () => {
    const newTheme = main_body.classList.contains('dark-mode')
      ? 'light'
      : 'dark'
    applyTheme(newTheme)
  })
}
