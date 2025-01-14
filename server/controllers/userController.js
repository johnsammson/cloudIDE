const User = require("../models/userModel")
const Admin  = require("../models/adminModel")

const { exec } = require('child_process');
const { promisify } = require('util');
const execAsync = promisify(exec);

const USER_DIR = '/tmp/user-files';

const registerUser = async (req,res) =>{
    const {username,email,password,role} = req.body
    if(!username || !password || !email) {
        console.log("please provide all details")
        res.status(400).json({error:"fileds not filled"})
    }
    try{
        const userCheck = await User.findOne({email})
        if(userCheck){
            res.status(500).json({error:"User exists"})
        }
        const lastUsedPort = await Admin.findOne().sort({ port: -1 }).exec();
        const newPort = lastUsedPort ? lastUsedPort.port + 1 : 6000; // Start at 6000 if no ports are used

        // Save the new port in the Admin collection
        const newPortEntry = new Admin({ port: newPort });
        await newPortEntry.save();

        // Create the user with the socket URL
        const socketUrl = `http://localhost:${newPort}`;
        const user = new User({username:username,email:email,password:password,role:role,socketUrl:socketUrl, port: newPort})
        user.save()
        console.log("user registered")
        res.status(200).json({message:"user registered successully",user:user})
    }catch(err){
        res.status(500).json({error:"user registration unsuccessful"})
    }
} 

const loginUser = async (req,res) =>{
    const {email,password} = req.body
    if(!password || !email) {
        console.log("please provide all details")
        res.status(400).json({error:"fileds not filled"})
    }
    try{
        const userCheck = await User.findOne({email})
        if(!userCheck){
            res.status(500).json({error:"invalid creds"})
        }
        const passCheck = password===userCheck.password
        if(!passCheck){
            res.status(500).json({error:"invalid creds"})
        }
        console.log("user logged in")
        res.status(200).json({message:"user logged in successully",user:userCheck})
    }catch(err){
        res.status(500).json({error:"user login unsuccessful"})
    }
}

const users = async (req, res) => {
    try {
        const users = await User.find();
        if (!users || users.length === 0) {
            return res.status(404).json({ error: "No users found" });
        }
    
        console.log("Fetched all users");
        res.status(200).json({ message: "Fetched all users", users });
    } catch (err) {
        console.error("Error fetching users:", err.message);
        res.status(500).json({ error: "Error fetching users" });
    }
}

module.exports={
    registerUser,
    loginUser,
    users
}
