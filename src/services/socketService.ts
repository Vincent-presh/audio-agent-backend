import {Server, Socket} from "socket.io";

let io: Server;

export const initializeSocket = (server: any) => {
  io = new Server(server, {
    cors: {
      origin: "http://localhost:3000", // Change to your frontend origin
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket: Socket) => {
    console.log(`Client connected: ${socket.id}`);

    // Send the socket ID to the client upon connection
    socket.emit("connected", {socketId: socket.id});

    socket.on("disconnect", () => {
      console.log(`Client disconnected: ${socket.id}`);
    });
  });

  return io;
};

export const getSocketInstance = () => {
  if (!io) {
    throw new Error("Socket.io not initialized");
  }
  return io;
};

export const emitTaskUpdate = (taskId: string, data: any) => {
  if (!io) {
    throw new Error("Socket.io not initialized");
  }
  io.emit(`task-update-${taskId}`, data);
};
