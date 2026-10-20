
const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);

app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

app.get("/", (req, res) => {
  res.send("Thindi real-time server is running");
});

io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  socket.on("join-order", (orderId) => {
    if (typeof orderId === "string" && orderId.trim()) {
      socket.join(`order-${orderId}`);
    }
  });

  socket.on("update-order-status", ({ orderId, status }) => {
    if (!orderId || !status) return;

    io.to(`order-${orderId}`).emit("order-status-updated", {
      orderId,
      status
    });
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

const PORT = 5000;

server.listen(PORT, () => {
  console.log(`Thindi real-time server listening on port ${PORT}`);
});
