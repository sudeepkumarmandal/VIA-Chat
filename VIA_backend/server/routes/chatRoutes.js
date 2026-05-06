const express = require("express");
const router = express.Router();

const {
  createRoom,
  deleteRoom,
  addUserToRoom,
  removeUserFromRoom,
  getUserRooms,
  getRoomUsers,
  sendMessage,
  getMessages,
} = require("../controllers/chatController");

router.post("/create-room", createRoom);
router.post("/Delete-room", deleteRoom);
router.post("/add-users", addUserToRoom);
router.post("/Remove-RoomUsers", removeUserFromRoom);
router.get("/creator-rooms/:userId", getUserRooms);
router.get("/rooms-users/:RoomId", getRoomUsers);

router.post("/send-message", sendMessage);
router.get("/messages/:roomId", getMessages);

module.exports = router;
