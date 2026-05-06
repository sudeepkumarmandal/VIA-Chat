const ChatRoom = require("../models/chatRoomModel")
const Message = require("../models/messageModel")



// CREATE ROOM

exports.createRoom = async (req, res) => {

  try {

    const { name, createdBy } = req.body

    const room = await ChatRoom.create({
      name,
      createdBy,
      users: [createdBy] // creator automatically added
    })

    res.json({
      success: true,
      roomId: room._id,
      room
    })

  } catch (error) {

    res.status(500).json({ error: error.message })

  }

}





//Delete Room 

exports.deleteRoom = async (req, res) => {

  try {

    const { roomId, userId } = req.body
    
    
    // check room exists
    const room = await ChatRoom.findById(roomId)

    if (!room) {
      return res.status(404).json({
        success: false,
        message: "Room not found"
      })
    }

    // only creator can delete
    if (room.createdBy.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "Only room creator can delete the room"
      })
    }

    await ChatRoom.findByIdAndDelete(roomId)

    res.json({
      success: true,
      message: "Room deleted successfully"
    })

  } catch (error) {

    res.status(500).json({
      error: error.message
    })

  }

}













//// ADD USER TO ROOM

exports.addUserToRoom = async (req, res) => {

  try {
  
  console.log("Add user to room ");
  
    const { roomId, users } = req.body
    console.log(users);
    
    
    const room = await ChatRoom.findByIdAndUpdate(
      roomId,
      { $addToSet: { users: users } }, // prevents duplicates
      { new: true }
    )

    res.json({
      success: true,
      room
    })

  } catch (error) {

    res.status(500).json({ error: error.message })

  }

}






//Remove User from room
exports.removeUserFromRoom = async (req, res) => {

  try {

    console.log("Remove user from room")

    const { roomId, users } = req.body

   
 
    const room = await ChatRoom.findByIdAndUpdate(
      roomId,
      { $pull: { users: { $in: users } } },
      { new: true }
    )

    res.json({
      success: true,
      room
    })

  } catch (error) {

    res.status(500).json({ error: error.message })

  }

}








/// GET ALL ROOMS CREATED BY USER

exports.getUserRooms = async (req, res) => {

  try {

    const userId = req.params.userId

    // find rooms where userId exists in users array
    const rooms = await ChatRoom.find({
      users: userId
    })
    .populate("users", "name email")
    .populate("createdBy", "name email")

    res.json({
      success: true,
      rooms
    })

  } catch (error) {

    res.status(500).json({
      error: error.message
    })

  }

}




//Get All user from on Specific Room
exports.getRoomUsers=async(req,res)=>{
try{
 console.log("find all rooms users",req.params.RoomId);
 
  const data=await ChatRoom.find({_id:req.params.RoomId}).populate("users", "name email")
  res.json(data)


}catch(error){
  res.status.json({error:error.message})

}
}


// SEND MESSAGE

exports.sendMessage = async (req, res) => {

try {

const { sender, roomId, message } = req.body

const newMessage = await Message.create({
sender,
roomId,
message
})

res.json({
success: true,
newMessage
})

} catch (error) {

res.status(500).json({
error: error.message
})

}

}

// // GET MESSAGES {


exports.getMessages = async (req, res) => {

try {
      const roomId = req.params.roomId.trim()

      const messages = await Message.find({"roomId":roomId}).populate("sender", "name email")



      res.json(messages)

   } catch (error) 
   {

      res.status(500).json({
      error: error.message
      })
}

}

