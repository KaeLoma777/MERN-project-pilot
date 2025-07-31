//This line imports the jwt package so we can check if the user's token is valid or not
import jwt from 'jsonwebtoken';

//This line brings in the user model so we can look up the user in the database using the ID from the token
import User from '../models/userModel.js';

//This function protects routes by checking if a valid token was sent with the request
const protect = async (req, res, next) => {
    let token;

    //This line checks if the request has an authorization header and if it starts with 'Bearer'
    //Bearer just means the request is carrying (bearing) the token like a keycard
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {

        // This line splits the Authorization header by space and pulls out the token part (after 'Bearer' is part [0] and the token is part[1])
        //We only want part [1] the actual token
        token = req.headers.authorization.split(' ')[1];


        try {
            //This line checks if the token is valid using the secrete key and gets the user's ID
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // This line looks up the user in the database using the ID we got from the token
            // The .select('-password') part tells it to leave out the password field (even though it's hashed)
            // We use the minus sign means to exclude it so we don’t send or use the password by mistake
            req.user = await User.findById(decoded.id).select('-password');

            //This line tells express to move to the next route handler after everything checks out (valid token, user found, etc)
            //next() is like a green light to move on to the next route
            next();

        } catch (error) {
            //If the token is invalid or something goes wrong during decoding, we throw an error 401
            return res.status(401).json({ message: 'Not authorized, token failed' });

        }

    }
    //This line checks if a token was found at all. If not, we return error code 401
    if (!token) {
        return res.status(401).json({ message: 'Not authorized, no token' });
    }
};

//This line exports the protect function so other files can use it to protect certain routes
export default protect;


