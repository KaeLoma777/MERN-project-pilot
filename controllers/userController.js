//import User model to interact with users collection
import User from '../models/userModel.js';
//import bcrypt to hash passwords securely
import bcrypt from 'bcrypt';
//import jsonwebtoken to create auth tokens
import jwt from 'jsonwebtoken';

// Export an async function named registerUser that takes in request and response objects
// This function will handle user registration by reading data sent by the client and sending a response
export const registerUser = async (req, res) => {
    try {
        //The client sends user info in req.body
        //I'm pulling the name, email, and password out of it using destructuring,
        //so I don't have to write req.body.name every time
        const { name, email, password } = req.body;

        //This line checks if the email the user entered already exists in the database. 
        // If it does, they’re told to log in instead of creating a duplicate account. If it doesn’t exist, we continue with registration.
        const userExists = await User.findOne({ email });

        //If user exists, stop registration and send back a 400 status with a message
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Use bcrypt to generate a random salt string.
        // This makes each password hash more secure and unique, even if users have the same password.
        // The '10' is the strength — how many rounds of processing to apply.
        const salt = await bcrypt.genSalt(10);

        //Hash the plain-text password with the generated salt
        const hashedPassword = await bcrypt.hash(password, salt);

        //Create a new user document in the database with name, email, and hashed password
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
        });

        // Create a signed JWT token containing the user's ID as the payload (data you want to send ex. user ID).
        // The token is signed with a secret from the .env file to ensure it can’t be faked.
        // It expires in 1 day, meaning the user will need to log in again after that.
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: '1d',
        });

        // When a new user registers, we hash their password using bcrypt before saving it to the database.
        // We then generate a JWT with their ID and send it back in the response so they can stay logged in securely.
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            token,
        });
    } catch (error) {
        //If any error occurs during registration, respond with status 500 and an error message
        res.status(500).json({ message: 'Server error' });
    }
};


// Export an async function named loginUser that takes in request and response objects
// This function will handle user login by reading checking credentials and sending back a token if it's valid
export const loginUser = async (req, res) => {
    try {

        //The client sends user info in req.body
        //I'm pulling the email and password out of it using destructuring,
        //so I don't have to write req.body.email every time
        const { email, password } = req.body;


        //This line checks the users collection to see if the email exists already
        const user = await User.findOne({ email });

        // If a user is not found, send out an error message
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        //This line checks if the password the user typed matches the hashed one stored in the database
        const isMatch = await bcrypt.compare(password, user.password);

        // If the password doesn't match, we send an error message
        if (!Match) {
            return res.status(400).json({ message: 'Invalid emal or password' });
        }

        //This line creates a secure token with the user’s ID so the frontend knows they’re logged in. The token expires in one day.
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: '1d',
        });


        //This line responds with a success message (200) and includes the token and user data so the frontend can store it
        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            token,
        });



    } catch (error) {

        // If any error happens, send back status 500 with message
        res.status(500).json({ message: 'Server error' });
    }
};

