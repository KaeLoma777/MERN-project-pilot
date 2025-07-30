//This line brings in mongoose so we can define our task schema
import mongoose from 'mongoose';

//This line creates a new schema (template) for what a task should look like in the database
const taskSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        description: {
            type: String,
        },
        //This line tracks if the task is completed or not. It defaults to false
        completed: {
            type: Boolean,
            default: false,
        },
        //This line links the task to the project it belongs to by its ID
        //'ref' lets Mongoose know which collection to look in (like project)
        project: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Project',
            required: true,
        },

        //This line links the task to the user who owns it
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
    },

    {
        //This line adds createdAt and updatedAt timestamps to each task automatically
        timestamps: true,
    }

);

//This line creates the task model using the schema so we can interact with the 'tasks' collection in the database
const Task = mongoose.model('Task', taskSchema);

//This line exports the model so other files can use it
export default Task;
