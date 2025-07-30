// Bring in Express so I can build the backend server
import express from 'express';
// Bring in Mongoose to connect and interact with my MongoDB database
import mongoose from 'mongoose';
// Load environment variables from .env file (like database URL, port, etc.)
import dotenv from 'dotenv';
// I’m importing all my user-related routes from the routes folder so I can use them in this main server file
import userRoutes from './routes/userRoutes.js';



// Run the dotenv config so my app can access values from .env
dotenv.config();

// Create the Express app — this will be my backend server
const app = express();

// Use middleware to tell Express to automatically parse JSON from requests
app.use(express.json());

// for any route starting with /api/users, use the router we just created. So /api/users/register now points to the registerUser controller.
app.use('/api/users', userRoutes);

// Connect to MongoDB using the URI I stored in .env
// If successful, log a message. If it fails, catch and show the error.
mongoose.connect(process.env.MONGODB_URI)
.then(() => console.log('MongoDB connected'))
.catch((err) => console.error('MongoDB connection error:', err));

// Choose which port the server should run on (use env first, or default to 3000)
const PORT = process.env.PORT || 3000;

// Start the server and listen for incoming requests
// When it starts successfully, log the port number
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});