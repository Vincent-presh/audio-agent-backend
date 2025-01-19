import express from "express";
import mongoose from "mongoose";
import http from "http";
import {Server} from "socket.io";
import taskRoutes from "./routes/taskRoutes";
import clientRoutes from "./routes/clientRoutes";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

// Middleware
app.use(express.json());
app.use("/api/tasks", taskRoutes);
app.use("/api/clients", clientRoutes);

// Attach Socket.IO to the app
app.set("io", io);

io.on("connection", (socket) => {
  console.log(`Client connected: ${socket.id}`);

  socket.on("disconnect", () => {
    console.log(`Client disconnected: ${socket.id}`);
  });
});

// MongoDB connection
mongoose.connect(process.env.MONGO_URI || "", {});

// Start server
const PORT = process.env.PORT || 9000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
