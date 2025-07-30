// I’m using Express’s Router to create route paths.
// I’m also importing the controller function that handles what should happen when someone tries to register.
import express from 'express';
import { registerUser, loginUser } from '../controllers/userController.js';

//This creates a new router that holds the routes
const router = express.Router();

// Create a POST route for user registration
// When a POST request is sent to /api/users/register, call registerUser controller to handle it
router.post('/register', registerUser);

//Create a POST route for user login
router.post('/login', loginUser);


// Export the router so we can use it in server.js
export default router;
