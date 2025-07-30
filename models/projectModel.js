import mongoose from "mongoose";

//This line defines what a Project document should look like in the database
//It includes a required name, an optional description, and the ID of the user who created it
const projectSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        description: {
            type: String,
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

// This line creates the Project model using the schema so we can interact with the 'projects' collection in the database
const Project = mongoose.model('Project', projectSchema);

// This line exports the Project model so we can use it elsewhere in our app
export default Project;

