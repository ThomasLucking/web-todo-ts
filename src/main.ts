import './assets/style.css'

import { AssociateCatgoriesAPI } from '../src/AssociateCategories/AssociateAPI'
import { TaskManager } from '../src/Task hooks/TaskManager'
import CategoryManager from './CategoriesHooks/CategoriesManager'
import { CategoryAPI } from './CategoryApiHandling/CategoryAPI'
import { TaskAPI } from './TaskApiHandling/TaskAPI'

const taskAPI = new TaskAPI()
const categoryAPI = new AssociateCatgoriesAPI()
const categoriesAPI = new CategoryAPI()

new CategoryManager(new CategoryAPI())
new TaskManager(taskAPI, categoryAPI, categoriesAPI)
