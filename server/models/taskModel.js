const mongoose = require("mongoose")

const taskSchema = new mongoose.Schema(
    {
        title:{
            type:String,
            required:true
        },
        assigned:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'User',
            required:true
        },
        startDate:{
            type:Date
        },
        endDate:{
            typr:Date
        },
        status: {
            type: String,
            enum: ["not started", "in progress", "completed", "on hold"],
            default: "not started"
        },
    },
{
    timestamps:true
})

const Task = mongoose.model('Task',taskSchema)
module.exports=Task