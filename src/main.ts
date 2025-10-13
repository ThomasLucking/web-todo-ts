
import './assets/style.css'
import CategoryManager from './CategoriesHooks/CategoriesManager'
import { CategoryAPI } from './CategoryApiHandling/CategoryAPI'
import TaskManager from './Task hooks/TaskManager'
import { TaskAPI } from './TaskApiHandling/TaskAPI'

new CategoryManager(new CategoryAPI())
new TaskManager(new TaskAPI())
