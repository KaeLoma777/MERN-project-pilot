import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import User from "../models/userModel.js";


//This the controller function that will handle user login
//It will be asynchronous because it talks to the database, which takes time
export const loginUser = async (req, res) => {
    try {
        //When a user submits their login form (email and password), it's sent to the request body
        //destructuring will shorten the code and make it cleaner
        const { email, password } = req.body;

        //Use mongoose findOne method to search the database for a user with email matching the one sent by client.
        //If there's a match, it'll return the user document
        const user = await User.findOne({ email });

        //If there's no match, it'll send back error 400 with message "Invalid email or password"
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        //bcrypt compare function will check the password matches the hashed password matches the database
        const isMatch = await bcrypt.compare(password, user.password);

        //If the password doesn't match the hashed one, send back an error 400 with invalid email and password message. Secures login process
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        //a special code is created with user's ID. The app will use this code to know the user is logged in without asking for password each time.
        //the code is only valid for one day, and user will need to login again
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: '1d',

        });

        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            token,
        });


    } catch (error) {

        //If anything goes wrong during login, send back an error 500 message
        res.status(500).json({ message: 'Server error' });
    }


};


