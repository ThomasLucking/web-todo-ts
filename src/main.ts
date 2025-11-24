import './assets/style.css'
import { AssociateCatgoriesAPI } from '../src/AssociateCategories/AssociateAPI'
import { TaskManager } from '../src/Task hooks/TaskManager'
import CategoryManager from './CategoriesHooks/CategoriesManager'
import { CategoryAPI } from './CategoryApiHandling/CategoryAPI'
import { TaskAPI } from './TaskApiHandling/TaskAPI'

const themeToggle = document.querySelector<HTMLButtonElement>('.theme-toggle') // or HTMLInputElement
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
  themeToggle.addEventListener('click', () => {
    const isCurrentlyDark = main_body.classList.contains('dark-mode')

    if (isCurrentlyDark) {
      main_body.classList.replace('dark-mode', 'light-mode')

      themeToggle.textContent = 'Toggle Dark Mode'
      localStorage.setItem(themePreferenceKey, 'light')
    } else {
      main_body.classList.replace('light-mode', 'dark-mode')

      themeToggle.textContent = 'Toggle Light Mode'
      localStorage.setItem(themePreferenceKey, 'dark')
    }
  })
}
