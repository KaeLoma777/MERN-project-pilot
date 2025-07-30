// Bring in Mongoose so I can define a schema and create a model
import mongoose from "mongoose";

// Blueprint for a User in the database
const userSchema = new mongoose.Schema(
    {
        username: { 
            type: String, // name must be a string
            required: true, // name is required
        },

        email: {
            type: String, // email must be a string
            required: true, // email is required
            unique: true, //has to be unique, no duplicate emails allowed
        },

        password: {
            type: String, // password must be a string
            required: true, // password is required
        },
    },
    {
        timestamps: true, // adds a timestamp: createdAt and updatedAt automatically
    }
);

// Create the User model from the schema
const User = mongoose.model('User', userSchema);

// Export the User model so I can use it in other files
export default User;