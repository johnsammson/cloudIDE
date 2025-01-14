const express = require("express")
const { registerUser, loginUser,users } = require("../controllers/userController")

const router = express.Router()

router.get("/", users)
router.post("/register",registerUser)
router.post("/login",loginUser)

module.exports=router