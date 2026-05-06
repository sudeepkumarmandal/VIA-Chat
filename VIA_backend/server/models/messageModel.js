const mongoose = require("mongoose")

const messageSchema = new mongoose.Schema({

  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  roomId: String,

  message: String,

  createdAt: {
    type: Date,
    default: Date.now
  }

})

module.exports = mongoose.model("Message", messageSchema)