//This line allows us to import task model and talk to the database
import Task from '../models/taskModel.js';


//This line will create a function that will let a user create a task inside a project
export const createTask = async (req, res) => {
    try {

        //This is the line that pulls name and description from the request body (the info the user sends)
        const {name, description} = req.body;

        //This line will pull the project ID from the url (/projects/:projectId/tasks)
        const projectId = req.params.projectId;

        //This line will tell the database to create new task using the info we provided
        const task = await Task.create({
            name,
            description,
            project: projectId, //link to the project
            user: req.user._id, //link to the user that's logged in
        });

        //This line will send back the new task and a confirmation that it worked status 201 OK
    } catch (error) {
        //As always if something goes wrong, this line will show the error 500 message
        res.status(500).json({message: 'Server error'});
    }
    
};

//This line creates a function to fetch all the tasks for a specific project
export const getAllTasks = async (req, res) => {
    try {

        //This line will pull the project ID from the url (/projects/:projectId/tasks)
        const projectId = req.params.projectId;

        //This line will find all the tasks that match the current user and the project
        const tasks = await Task.find({
            user: req.user._id, //only shows the tasks that's owned by the user that's logged in
            project: projectId, //only shows tasks inside a specific project
        });

        //This line will send the tasks that were found and send a successful confirmation code (200 OK)
        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({message: 'Server error'});
    }
};

//This function will find and retrun a single task by ID if the user owns it and it's part of the correct project
export const getSingleTask = async (req, res) => {
    try {

        //This line will pull the task ID and project ID from the url parameters
      const {projectId, taskId} = req.params;

    //This line checks the database for a task that mataches the ID, project, and the user
    const task = await Task.findOne({
        _id: taskId,
        project: projectId,
        user: req.user._id,
    });

    //If no task is found, we throw out an error 404 message
    if (!task) {
        return res.status(404).json({message: 'Task not found'});
    }

    //If the task is found, this line will send the successful 200 OK message
    res.status(200).json(task);

} catch (error) {
    res.status(500).json({message: 'Server error'});
}

};

//This line is a function that updates a task by ID if the task belongs to the user and is part of the given project
export const updateTask = async (req, res) => {
    try {

        //This line will pull the project ID and task ID from the url
        const { projectId, taskId} = req.params;

        //THis line will pull any updates the user sent (name, description, completed)
        const {name, description, completed} = req.body;

        //This line will check the database for the task and 
        //updates it if it matches task ID, project it belongs to, and what user owns it
        //The {new: true} means it will return the updated version of the task instead of the old one
        const updatedTask = await Task.findOneAndUpdate(
            {_id: taskId, project: projectId, user: req.user._id},
            {name, description, completed},
            {new: true}
        );

        //If no task found to update, we return error 404 message
        if (!updatedTask) {
            return res.status(404).json({message: 'Task not found'});
        }

        //If the task was successfully updated, we send status 200 OK
        res.status(200).json(updatedTask);
    } catch (error) {
        res.status(500).json({message: 'Server error'});
    }
};

//This line creates a function that will delete a task if the task belongs to the user and is part of the project
export const deleteTask = async (req, res) => {
    try {
        //This line will pull the project ID and task ID from the url
        const {projectId, taskId} = req.params;

        //This line will try to find and delete the task that matches task ID, project it belongs to, and who owns the task
        const deleteTask = await Task.findOneAndDelete({
            _id: taskId,
            project: projectId,
            user: req.user._id,
        });

        //If there's no task found to delete, sends error 404
        if (!deletedTask) {
            return res.status(404).json({message: 'Task not found'});
        }

        //If a task was successfully deleted, we send the 200 OK status
        res.status(200).json({message: 'Task deleted successfully'});
    } catch (error) {
        res.status(500).json({message: 'Server error'});
    }
};