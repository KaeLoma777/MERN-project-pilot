import express from 'express';

//This line will import the task controller functions
import {createTask,
        getAllTasks,
        getSingleTask,
        updateTask,
        deleteTask,
} from '../controllers/taskController.js';

//This line will import the middleware that protects the routes
import protect from '../middleware/authMiddleware.js';

//This line allows you to access the projectId from the parent route(/api/projects/:projectId/tasks)
//without mergeParams: true, req.params.projectId would be undefined
//It allows you to grab projectId from req.params and use it inside task controllers
const router = express.Router({mergeParams: true});

//This route handles GET all tasks and POST a new task for a specific project
router.route('/').post(protect, createTask)
.get(protect, getAllTasks);

//This route will handle GET one task, PUT to update a task, and DELETE to delete by ID
router.route('/:taskId').get(protect, getSingleTask)
.put(protect, updateTask)
.delete(protect, deleteTask);

//export this so it can be used in server.js
export default router;
