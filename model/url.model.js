const mongoose = require("mongoose")

const urlSchema = new mongoose.Schema({
    originalUrl:{
        type:String,
        required:true
    },
    shortCode:{
        type:String,
        required:true,
        unique:true
    },
    visitHistory:[{timestamp:{type:Number}}],
    user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
},{timestamps:true})

module.exports = mongoose.model("Url",urlSchema)