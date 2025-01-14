const express = require("express")
const cors = require("cors")
const mongoose = require("mongoose")
require("dotenv").config()
const userRoute = require("./routes/userRoute")
const containerRoute = require("./routes/ContainerRoute")

const app = express()
const DB_URI = process.env.DB_URI

app.use(cors())
app.use(express.json())

mongoose.connect(DB_URI).then(()=>{
    console.log("DB Connected")
    
})
.catch((error)=>console.log("DB not connected", error))

app.use("/user",userRoute)
app.use("/container", containerRoute)
app.get("/ping", (req, res) => {
    res.send("pong");
})


app.listen(4000, () => console.log(`Listening on port 4000`));
