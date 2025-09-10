import { rooms } from "../config/database.js";
import { compileCode } from "../controllers/codeController.js";
import {
  joinRoom,
  leaveRoom,
  handleCodeChange,
  handleTyping,
  handleLanguageChange,
} from "../controllers/roomController.js";

export const handleSocketConnection = (io) => {
  io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);

    // Initialize socket properties
    socket.currentRoom = null;
    socket.currentUser = null;

    // Room management
    socket.on("join", (data) => {
      joinRoom(socket, data);
    });

    socket.on("leaveRoom", () => {
      leaveRoom(socket);
    });

    // Code collaboration
    socket.on("codeChange", (data) => {
      handleCodeChange(socket, data);
    });

    socket.on("typing", (data) => {
      handleTyping(socket, data);
    });

    socket.on("languageChange", (data) => {
      handleLanguageChange(socket, data);
    });

    // Code compilation
    socket.on("compileCode", async ({ code, roomId, language, version }) => {
      try {
        if (rooms.has(roomId)) {
          const response = await compileCode(code, language, version);
          io.to(roomId).emit("codeResponse", response);
        }
      } catch (error) {
        socket.emit("codeResponse", {
          run: {
            output: "Error: Failed to compile code",
          },
        });
      }
    });

    // Handle disconnection
    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.id}`);
      leaveRoom(socket);
    });
  });
};
