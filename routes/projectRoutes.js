//This line imports express so we can use the route feature
import express from 'express';

//This line brings in all the controller functions we wrote for handling project actions
import {
    createProject,
    getAllProjects,
    getSingleProject,
    updateProject,
    deleteProject,
} from '../controllers/projectController.js';

//This line imports the middleware that protects routes and checks if the user is logged in
import {protect} from '../middleware/authMiddleware.js';

//This line creates a new router instance that we can attach routes to
const router = express.Router();

//This line sets up a route to create a new project and get all the projects
//The protect middleware makes sue the user is logged in before accessing the projects
router.route('/').post(protect, createProject)
.post(protect, createProject)
.get(protect, getAllProjects);

//This line sets up routes for getting, updating, and deleting a specific project by ID
router.route('/:id').get(protect, getSingleProject)
.put(protect, updateProject)
.delete(protect, deleteProject);

//This line exports the router so we can use it in server.js
export default router;
