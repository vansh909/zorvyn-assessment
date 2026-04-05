const mongoose = require('mongoose');

//schema for user
const userSchema = new mongoose.Schema({
    username:{
      type:String,
      required: true  
    },
    email:{
        type:String,
        required:true,
        unique: true
    },
    password:{
        type:String,
        required: true
    },
    role:{
        type:String,
        enum:["admin", "analyst", "viewer"],
        required:true
    },
    status:{
        type: String,
        enum:["active", "inactive"],
        required: true,
    }

}, {timestamps: true});


const user = mongoose.model("user",userSchema);

module.exports = user;