import express from "express";
import http from "http";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173"],
  },
});

const userSocketMap = {}; // {userId: socketId}

export function getReceiverSocketId(userId) {
  return userSocketMap[userId];
}
io.on("connection", (socket) => {
  console.log("✅ A user connected:", socket.id);

  try {
    const userId = socket.handshake.query.userId;
    if (userId) {
      userSocketMap[userId] = socket.id;
      socket.userId = userId;
    }

    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  } catch (error) {
    console.error("❌ Error handling connection:", error);
  }

  socket.on("disconnect", () => {
    console.log("⚠️ A user disconnected:", socket.id);

    try {
      if (socket.userId && userSocketMap.hasOwnProperty(socket.userId)) {
        delete userSocketMap[socket.userId];
      }

      io.emit("getOnlineUsers", Object.keys(userSocketMap));
    } catch (error) {
      console.error("❌ Error handling disconnection:", error);
    }
  });
});

export { app, server, io };
