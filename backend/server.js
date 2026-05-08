const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "http://localhost:5173", methods: ["GET", "POST"] }
});

app.use(cors());
app.use(express.json());
app.set("socketio", io);

io.on("connection", (socket) => {
  socket.on("join_room", (userId) => {
    socket.join(userId);
  });
  socket.on("send_message", (data) => {
    socket.to(data.receiverId).emit("receive_message", data);
  });
});

app.use("/api/auth", require("./routes/auth"));
app.use("/api/requests", require("./routes/requests"));

mongoose.connect("mongodb+srv://Team_26:SkillSwap%4026@cluster0.cmxkviq.mongodb.net/SkillSwap?retryWrites=true&w=majority")
  .then(() => console.log("DB Connected"))
  .catch((err) => console.error("DB Error:", err));

server.listen(5000, () => console.log("Server running on port 5000"));