import express from "express";
import mongoose from "mongoose";
import http from "http";
import taskRoutes from "./routes/taskRoutes";
import clientRoutes from "./routes/clientRoutes";
import {initializeSocket} from "./services/socketService";
require("dotenv").config();
const cors = require("cors");

const app = express();
const server = http.createServer(app);

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000", // Change to your frontend origin
    methods: "GET,POST,PUT,DELETE",
    allowedHeaders: "Content-Type,Authorization",
  })
);

app.use("/api/tasks", taskRoutes);
app.use("/api/clients", clientRoutes);

// Initialize socket
const io = initializeSocket(server);
app.set("io", io);

// MongoDB connection
mongoose.connect(process.env.MONGO_URI || "", {});

// Start server
const PORT = process.env.PORT;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// Export app and server
export {app, server};
