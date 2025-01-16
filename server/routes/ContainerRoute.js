const express = require("express")

const router = express.Router()

const fs = require('fs/promises');
const path = require('path');
const { exec } = require('child_process');
const { promisify } = require('util');
const execAsync = promisify(exec);

const USER_DIR = '/tmp/user-files';

router.get("/",(req,res)=>{
    res.send("Container Route")
})
async function createContainerForUser(userId, port ) {
    const containerName = `user-${userId}-container`;
    const userDir = `${USER_DIR}/${userId}`;
    
    try {
        await execAsync(`mkdir -p ${userDir}`);
        await execAsync(`docker run -d --name ${containerName} -p ${port}:9000 mahesh7736/ubuntu-ide-server`);
        return containerName;
    } catch (error) {
        console.error(`Failed to create container for user ${userId}:`, error);
        throw error;
    }
}
router.get("/ping", (req, res) => {
    res.send("pong");
})
router.get("/socketurl", (req, res) => {
    res.json({"url":"http://localhost:5001"});
});
router.post('/create-container/:userId/:port', async (req, res) => {
    const { userId,port } = req.params;
    try {
        const containerName = await createContainerForUser(userId,port);
        res.json({ containerId: containerName });
    } catch (error) {
        res.status(500).json({ error: 'Failed to create container' });
    }
});

router.post('/execute-command', (req, res) => {
    const { userId, command } = req.body;
    const containerName = `user-${userId}-container`;
  
    exec(`docker exec ${containerName} ${command}`, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error: ${error.message}`);
        return res.status(500).json({ error: 'Command execution failed' });
      }
      res.json({ output: stdout, error: stderr });
    });
  });

module.exports=router
