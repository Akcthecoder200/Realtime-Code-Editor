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

const rooms = new Map();
const whiteboardStates = new Map(); // roomId -> latest tldraw document state

io.on("connection", (socket) => {
  console.log("User Connected", socket.id);

  let currentRoom = null;
  let currentUser = null;

  socket.on("join", ({ roomId, userName }) => {
    if (currentRoom) {
      socket.leave(currentRoom);
      rooms.get(currentRoom).delete(currentUser);
      io.to(currentRoom).emit("userJoined", Array.from(rooms.get(currentRoom)));
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
      rooms.get(currentRoom).delete(currentUser);
      io.to(currentRoom).emit("userJoined", Array.from(rooms.get(currentRoom)));

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

 

  //tldraw
  socket.on("whiteboard-update", ({ roomId, changes, fullState }) => {
    // If a fullState is provided, update the room's state
    if (fullState) {
      whiteboardStates.set(roomId, fullState);
    }
    // Always broadcast the changes
    socket.to(roomId).emit("whiteboard-update", changes);
  });

  // When a client requests the full whiteboard state, another client should respond
  socket.on("request-whiteboard-state", () => {
    socket.to(currentRoom).emit("request-whiteboard-state");
  });

  // When a client sends the full whiteboard state, store it and send to the requester
  socket.on("whiteboard-state", ({ fullState, roomId }) => {
    if (roomId && fullState) {
      whiteboardStates.set(roomId, fullState);
      socket.emit("whiteboard-state", { fullState }); // send to the requester
    }
  });

  socket.on("compileCode", async ({ code, roomId, language, version }) => {
    if (rooms.has(roomId)) {
      const room = rooms.get(roomId);
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

      room.output = response.data.run.output;
      io.to(roomId).emit("codeResponse", response.data);
    }
  });

  socket.on("disconnect", () => {
    if (currentRoom && currentUser) {
      rooms.get(currentRoom).delete(currentUser);
      io.to(currentRoom).emit("userJoined", Array.from(rooms.get(currentRoom)));
      // Optionally, clean up whiteboard state if no users left
      if (rooms.get(currentRoom).size === 0) {
        whiteboardStates.delete(currentRoom);
      }
    }
    console.log("user Disconnected");
  });
});

const port = process.env.PORT || 5000;

const __dirname = path.resolve();

app.use(express.static(path.join(__dirname, "/frontend/dist")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "/frontend/dist/index.html"));
});

server.listen(port, () => {
  console.log(`server is working on port ${port}`);
});

