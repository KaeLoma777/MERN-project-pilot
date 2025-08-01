// Bring in Express so I can build the backend server
import express from 'express';
// Bring in Mongoose to connect and interact with my MongoDB database
import mongoose from 'mongoose';
// Load environment variables from .env file (like database URL, port, etc.)
import dotenv from 'dotenv';
// I’m importing all my user-related routes from the routes folder so I can use them in this main server file
import userRoutes from './routes/userRoutes.js';
//We're grabbing connectDB function from config/db.js file so it can be used here
import connectDB from './config/db.js';
// This line imports all the task routes so we can use them in server.js
import taskRoutes from './routes/taskRoutes.js';
import projectRoutes from './routes/projectRoutes.js'
//CORS will allow my backend to talk to my frontend without issues
import cors from 'cors';

// Run the dotenv config so my app can access values from .env
dotenv.config();

// Create the Express app — this will be my backend server
const app = express();

connectDB();

// Use middleware to tell Express to automatically parse JSON from requests
app.use(express.json());

//This line turns on CORS for my backend
//It's like unlocking the door so my frontend can send requests and get responses from my API
app.use(cors());

// for any route starting with /api/users, use the router we just created. So /api/users/register now points to the registerUser controller.
app.use('/api/users', userRoutes);

app.use('/api/projects', projectRoutes);

//This line will connect task and related routes to make them accessible as /api/projects/:projectId/tasks
app.use('/api/projects/:projectId/tasks', taskRoutes)

// Connect to MongoDB using the URI I stored in .env
// If successful, log a message. If it fails, catch and show the error.
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.error('MongoDB connection error:', err));

// Choose which port the server should run on (use env first, or default to 3000)
const PORT = process.env.PORT || 5000;

// Start the server and listen for incoming requests
// When it starts successfully, log the port number
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});