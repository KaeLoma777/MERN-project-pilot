//This line imports the project model and gives us access to the database so we can create find, update, or delete a project
import Project from "../models/projectModel.js";

//This line creates a function to add a new project when the user asks to create one
//it's also an async function because it talks to the database, which takes time
export const createProject = async (req, res) => {

    // The try block contains code that might fail like database calls
    try {
        //This line pulls name and description from the request body
        //The client sends the info when creating a new project
        //We destructure to make the code shorter so we don't keep writing req.body.name every time  
        const { name, description } = req.body;


        //This line tells the database to make a new project with the info and link it to the current user
        //We pass the name and description the client sent
        //We also add the user ID from the user to link this project to its owner
        const project = await Project.create({
            name,
            description,
            user: req.user._id,
        });

        //This line sends back a response with status (201 OK) to show that project was created, along with project info
        //It also sends the newly created project data as JSON so the client knows that it worked
        res.status(201).json(project);

        //If an error happens, the catch block runs and sends back a server error response.
    } catch (error) {

        //If something goes wrong we throw an error 500 message
        //It also prevents the app from crashing and shows an error message instead
        res.status(500).json({ message: 'Server error' });
    }

};
// This line creates a function to get all projects that belong to the logged-in user
export const getAllProjects = async (req, res) => {
    try {

        //This line asks the database for all the projects that match the current user’s ID
        const projects = await Project.find({ user: req.user._id });

        //This line sends the list of projects back to the user and shows a success status code (200)
        res.status(200).json(projects);

        //If an error happens, the catch block runs and sends back a server error response.
    } catch (error) {

        //If something goes wrong we throw an error 500 message
        res.status(500).json({ message: 'Server error' });
    }
};

//This line creates a function to get one project based on the project ID in the URL
export const getSingleProject = async (req, res) => {
    try {
        // This line pulls the project ID from the URL parameters. for example if the user visits /projects/proj234
        //then req.params.id will equal 'proj234'. This is stored in projectId
        //later we can look it up in the database
        const projectId = req.params.id;

        //This line asks the database to find a project by ID that belongs to the current user
        const project = await Project.findOne({
            _id: projectId,
            user: req.user._id,
        });

        //If no project is found, this line sends an eror 404 message that the project doesn't exist
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        //If a project is found, this line sends a success status code (200 OK)
        res.status(200).json(project);

        //If there's any error, this line catches and sends error 500 message so the app/site doesn't crash 
    } catch (error) {

        res.status(500).json({ message: 'Server error' });
    }
};

//This line creates a function to update details of a specififc project by its ID
export const updateProject = async (req, res) => {
    try {

        //This line grabs the project ID from the URL (like /projects/:id)
        const projectId = req.params.id;

        //This line pulls the new name and description from the user's request body
        const { name, description } = req.body;

        //This line looks for the project by ID and user ID, then updates its name and description
        //The { new: true } option makes sure we get the updated version of the project back instead of the old one
        const updatedProject = await Project.findOneAndUpdate(
            { _id: projectId, user: req.user._id },
            {name, description},
            {new: true}
        );

        //If no project is found, it triggers an error 404 with message
        if (!updatedProject) {
            return res.status(404).json({ message: 'Project not found' });
        }

        //This line will send back the updated project details and a success status (200 OK)
        res.status(200).json(updatedProject);

        //This line prepares an error 500 message in case something goes wrong and keeps the app/site from crashing
    } catch (error) {


        res.status(500).json({ message: 'Server error' });
    }
};

//This line creates a function to delete a project by its ID
export const deleteProject = async (req, res) => {
    try {

        //This line gets the project ID from the URL (like /projects/:id)
        const projectId = req.params.id;


        //This line tries to find and delete the project that matches both the ID and user
        const deletedProject = await Project.findOneAndDelete({
            _id: projectId,
            user: req.user._id,
        });

        //If there are no matching projects found, we send an 404 error message
        if (!deletedProject) {
            return res.status(404).json({message: 'Project not found'});
        }


        //If a project is deleted successfully, we send back a successful status 200 OK

    } catch (error) {

        //If anything goes wrong, this line will send an error 500 message to prevent app/site from crashing
        res.status(500).json({message: 'Server error'});
    }
};


