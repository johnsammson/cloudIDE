const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    role:{
        type:String
    },
    socketUrl:{
        type:String
    },
    port:{
        type:Number
    },
    projects:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Project'
    }]
},{
    timestamps:true
})

const User =  mongoose.model('User',userSchema)
module.exports = User