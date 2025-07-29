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
        const userExists = await User.findOne({email});
       
        //If user exists, stop registration and send back a 400 status with a message
        if (userExists) {
            return res.status(400).json({message: 'User already exists'});
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
        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {
            expiresIn: '1d',
        });

        //Respond with status 201 (Created) and send back the user's info and the JWT token
        res.status(201).json({
            _id: user_id,
            name: user.name,
            email: user.email,
            token,
        });
    } catch (error) {
        //If any error occurs during registration, respond with status 500 and an error message
        res.status(500).json({message: 'Server error'});
    }
};

