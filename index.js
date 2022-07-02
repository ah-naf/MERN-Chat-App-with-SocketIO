const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
require("dotenv").config();
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const path = require("path");

const app = express();

const server = http.createServer(app);
const io = new Server(server, {
  cors: "*",
});

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Conntected To MongoDB"));

app.use(cookieParser());
app.use(cors());
app.use(express.json());

app.use("/api/auth", require("./routes/auth"));
app.use("/api/search", require("./routes/search"));
app.use("/api/chat", require("./routes/chat"));
app.use("/api/message", require("./routes/message"));

app.get('/', (req, res) => {
  res.json("HELLO")
})

server.listen(PORT, () => {
  console.log(`Listening on ${PORT}`);
});

io.on("connection", (socket) => {
  socket.on("join-room", (conversationId) => {
    socket.join(conversationId);
  });
  socket.on("send-message", (msg, conversationId) => {
    socket.nsp.to(conversationId).emit("get-message", msg, conversationId);
  });
});
