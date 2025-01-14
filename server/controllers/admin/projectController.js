const Project = require("../../models/projectModel")
const getAllProjects = async(req,res) =>{
    try{
        const projects = Project.find()
        if(!projects) res.status(404).json({error:"No projects found"})
        console.log("Fetched all projects")
        res.status(200).json({message:"Fetched all projects",projects:projects})
    }catch(err){
        res.status(500).json({error:"Projects unable to fetch"})
    }
}

const deleteProject = async (req,res) =>{
    const {projId} = req.params
    if(!projId) res.status(500).json({error:"Provide project ID"})
        
        try {
            const project = await Project.findByIdAndDelete(projId);
            if (!project) {
                return res.status(404).json({ error: "Project not found" });
            }
    
            console.log("Project deleted successfully");
            res.status(200).json({ message: "Project deleted successfully", project });
        } catch (err) {
            console.error("Error deleting project:", err.message);
            res.status(500).json({ error: "Error deleting project" });
        }
}

module.exports={
    getAllProjects,
    deleteProject
}