import express from "express";
import http from "http";
import { Server } from "socket.io";
import axios from "axios";
import path from "path";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

// In-memory storage
const rooms = new Map();
const whiteboardStates = new Map();

// Socket.IO connection handling
io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);
  
  let currentRoom = null;
  let currentUser = null;

  socket.on("join", ({ roomId, userName }) => {
    if (currentRoom) {
      socket.leave(currentRoom);
      rooms.get(currentRoom)?.delete(currentUser);
      io.to(currentRoom).emit("userJoined", Array.from(rooms.get(currentRoom) || []));
    }

    currentRoom = roomId;
    currentUser = userName;

    socket.join(roomId);

    if (!rooms.has(roomId)) {
      rooms.set(roomId, new Set());
    }

    rooms.get(roomId).add(userName);
    io.to(roomId).emit("userJoined", Array.from(rooms.get(currentRoom)));

    // When a user joins, send them the current whiteboard state if it exists
    if (whiteboardStates.has(roomId)) {
      socket.emit("whiteboard-state", {
        fullState: whiteboardStates.get(roomId),
      });
    } else {
      // If no state, request it from other clients in the room
      socket.to(roomId).emit("request-whiteboard-state");
    }
  });

  socket.on("codeChange", ({ roomId, code }) => {
    socket.to(roomId).emit("codeUpdate", code);
  });

  socket.on("leaveRoom", () => {
    if (currentRoom && currentUser) {
      rooms.get(currentRoom)?.delete(currentUser);
      io.to(currentRoom).emit("userJoined", Array.from(rooms.get(currentRoom) || []));

      socket.leave(currentRoom);

      currentRoom = null;
      currentUser = null;
    }
  });

  socket.on("typing", ({ roomId, userName }) => {
    socket.to(roomId).emit("userTyping", userName);
  });

  socket.on("languageChange", ({ roomId, language }) => {
    io.to(roomId).emit("languageUpdate", language);
  });

  socket.on("compileCode", async ({ code, roomId, language, version }) => {
    try {
      if (rooms.has(roomId)) {
        const response = await axios.post(
          "https://emkc.org/api/v2/piston/execute",
          {
            language,
            version,
            files: [
              {
                content: code,
              },
            ],
          }
        );

        io.to(roomId).emit("codeResponse", response.data);
      }
    } catch (error) {
      console.error("Code compilation error:", error);
      socket.emit("codeResponse", {
        run: {
          output: "Error: Failed to compile code",
        },
      });
    }
  });

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
    if (currentRoom && currentUser) {
      rooms.get(currentRoom)?.delete(currentUser);
      io.to(currentRoom).emit("userJoined", Array.from(rooms.get(currentRoom) || []));
      // Optionally, clean up whiteboard state if no users left
      if (rooms.get(currentRoom)?.size === 0) {
        whiteboardStates.delete(currentRoom);
        rooms.delete(currentRoom);
      }
    }
  });
});

const PORT = process.env.PORT || 4000;
const __dirname = path.resolve();

// Serve static files from React app
app.use(express.static(path.join(__dirname, "/frontend/dist")));

// Handle React Router routes
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "/frontend/dist/index.html"));
});

app.get("/roompage", (req, res) => {
  res.sendFile(path.join(__dirname, "/frontend/dist/index.html"));
});

app.get("/room/:roomId?", (req, res) => {
  res.sendFile(path.join(__dirname, "/frontend/dist/index.html"));
});

// Fallback for any other routes (SPA support)
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "/frontend/dist/index.html"));
});

server.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
