import './assets/style.css'

import CategoryManager from './CategoriesHooks/CategoriesManager'
import { CategoryAPI } from './CategoryApiHandling/CategoryAPI'
import TaskManager from './Task hooks/TaskManager'
import { TaskAPI } from './TaskApiHandling/TaskAPI'

const categoryApi = new CategoryAPI()
const categoryManager = new CategoryManager(categoryApi)

const api = new TaskAPI()
const taskManager = new TaskManager(api)
