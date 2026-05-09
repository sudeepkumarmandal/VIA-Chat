require("dotenv").config({ path: "./server/.env" });

const http = require("http");
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/DB_conn");

const authRoutes = require("./routes/authRoutes");
const chatRoutes = require("./routes/chatRoutes");
const UserRouter = require("./routes/userRoute");
const agoraRoutes = require("./routes/agoraRoutes");
const chatSocket = require("./sockets/chatSocket");

const app = express();

// Middleware
// app.use(
//   cors({
//     origin: ["http://localhost:5174", "https://via-frontend2.onrender.com"],
//     // "https://via-frontend2.onrender.com",
//     methods: ["GET", "POST"],
//   }),
// );
// app.use(cors({
//   origin: "http://localhost:5173",
//   methods: ["GET","POST","PUT","DELETE"],
//   credentials: true
// }));
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://via-frontend2.onrender.com"
  ],
  methods: ["GET","POST","PUT","DELETE"],
  credentials: true
}));
app.use(express.json());
// Connect Database
connectDB();

const PORT = process.env.PORT || 5000;

// create http server
const server = http.createServer(app);
const { Server } = require("socket.io");

// create socket server
const io = new Server(server, {
  cors: {
    origin: ["https://via-frontend2.onrender.com","http://localhost:5173"]
  },
});

// run socket logic
chatSocket(io);

// start server
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

app.use("/api/auth", authRoutes);

app.use("/api/chat", chatRoutes);

app.use("/api/user", UserRouter);

//Agora Routers

app.use("/api/agora", agoraRoutes);
