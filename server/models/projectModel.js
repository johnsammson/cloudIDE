const mongoose = require("mongoose")

const projectSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    title:{
        type:String,
        required:true
    },
    description:{
        type:String
    },
    status: {
        type: String,
        enum: ["not started", "in progress", "completed", "on hold"],
        default: "not started"
    },
    startDate:{
        type:Date
    },
    endDate:{
        type:Date
    },
    manager:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    members:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'User'
        }
    ],
    tasks:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'Task'
        }
    ]
},{
    timestamps:true
})

const Project = mongoose.model('Project',projectSchema)
module.exports=Project