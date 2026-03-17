const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        match: [/^[a-zA-Z0-9._%+-]+@gmail\.com$/, 'Please enter a valid @gmail.com address']
    },
    password:{
        type:String,
        required:true,
        minlength:6
    },
},{timestamps:true})

module.exports = mongoose.model("User",userSchema)