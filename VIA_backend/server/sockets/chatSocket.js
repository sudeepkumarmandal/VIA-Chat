const Message = require("../models/messageModel");
let users = {};
module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log("User Connected:", socket.id);

    socket.on("register", (userId) => {
      users[userId] = socket.id;
      console.log("User registered:", userId);
    });

    // Join Room

    socket.on("joinRoom", (roomId) => {
      socket.join(roomId);

      console.log("User joined room:", roomId);
    });

    // Send Message

    socket.on("sendMessage", async (data) => {
      const { roomId, senderId, message } = data;

      const newMessage = await Message.create({
        sender: senderId,
        roomId,
        message,
      });
      const messageWithUser = await newMessage.populate("sender", "_id name");

      io.to(roomId).emit("receiveMessage", messageWithUser);
    });

    // Leave Room

    socket.on("leaveRoom", (roomId) => {
      socket.leave(roomId);
    });

    socket.on("disconnect", () => {
      console.log("User Disconnected:", socket.id);

      for (let userId in users) {
        if (users[userId] === socket.id) {
          delete users[userId];
          console.log("Removed user:", userId);
          break;
        }
      }
    });

    //HANDLE OFFLINE USER

    socket.on("callRoom", ({ roomId, from, name, usersInRoom }) => {
      let atLeastOneOnline = false;

      usersInRoom.forEach((userId) => {
        if (userId !== from) {
          const targetSocket = users[userId];

          if (targetSocket) {
            atLeastOneOnline = true;

            io.to(targetSocket).emit("incomingCall", {
              from,
              roomId,
              name,
            });
          }
        }
      });

      // ❌ no one online
      if (!atLeastOneOnline) {
        const callerSocket = users[from];

        if (callerSocket) {
          console.log("🚨 Emitting userOffline to:", from);
          io.to(callerSocket).emit("userOffline");
        }
      }
    });

    socket.on("acceptCall", ({ to, roomId }) => {
      const targetSocket = users[to];

      if (targetSocket) {
        io.to(targetSocket).emit("callAccepted", { roomId });
      }
    });

    socket.on("rejectCall", ({ to }) => {
      const targetSocket = users[to];

      if (targetSocket) {
        io.to(targetSocket).emit("callRejected");
      }
    });

    socket.on("endCall", ({ roomId, usersInRoom }) => {
      usersInRoom.forEach((userId) => {
        const targetSocket = users[userId];
        if (targetSocket) {
          io.to(targetSocket).emit("callEnded");
        }
      });
    });
  });
};
