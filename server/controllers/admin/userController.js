const User = require("../../models/userModel");


const addUser = async (req, res) => {
    const { username, email, password, role } = req.body;

    if (!username || !email || !password) {
        console.log("Please provide all details");
        return res.status(400).json({ error: "Fields not filled" });
    }

    try {
        const userCheck = await User.findOne({ email });
        if (userCheck) {
            return res.status(400).json({ error: "User already exists" });
        }

        const user = new User({ username, email, password, role });
        await user.save();
        console.log("User added successfully");
        res.status(201).json({ message: "User added successfully", user });
    } catch (err) {
        console.error("Error adding user:", err.message);
        res.status(500).json({ error: "User addition unsuccessful" });
    }
};

const getAllUsers = async (req, res) => {
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
};

const deleteUser = async (req, res) => {
    const { userId } = req.params;

    if (!userId) {
        console.log("User ID not provided");
        return res.status(400).json({ error: "User ID is required" });
    }

    try {
        const user = await User.findByIdAndDelete(userId);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        console.log("User deleted successfully");
        res.status(200).json({ message: "User deleted successfully", user });
    } catch (err) {
        console.error("Error deleting user:", err.message);
        res.status(500).json({ error: "Error deleting user" });
    }
};

module.exports = { 
    addUser, 
    getAllUsers, 
    deleteUser };
