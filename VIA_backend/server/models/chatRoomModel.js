const mongoose = require("mongoose")

const chatRoomSchema = new mongoose.Schema({

  name:{
    type:String,
    required:true
  },

   createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  users: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }],

  isGroup:{
    type:Boolean,
    default:false
  }


},{timestamps:true})

module.exports = mongoose.model("ChatRoom", chatRoomSchema)