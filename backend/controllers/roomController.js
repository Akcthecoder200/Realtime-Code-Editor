import { rooms, whiteboardStates } from "../config/database.js";

export const joinRoom = (socket, { roomId, userName }) => {
  // Leave current room if already in one
  if (socket.currentRoom && socket.currentUser) {
    socket.leave(socket.currentRoom);
    rooms.get(socket.currentRoom)?.delete(socket.currentUser);
    socket.to(socket.currentRoom).emit("userJoined", Array.from(rooms.get(socket.currentRoom) || []));
  }

  // Join new room
  socket.currentRoom = roomId;
  socket.currentUser = userName;
  socket.join(roomId);

  // Initialize room if it doesn't exist
  if (!rooms.has(roomId)) {
    rooms.set(roomId, new Set());
  }

  rooms.get(roomId).add(userName);
  socket.to(roomId).emit("userJoined", Array.from(rooms.get(roomId)));

  // Send current whiteboard state if it exists
  if (whiteboardStates.has(roomId)) {
    socket.emit("whiteboard-state", {
      fullState: whiteboardStates.get(roomId),
    });
  } else {
    socket.to(roomId).emit("request-whiteboard-state");
  }
};

export const leaveRoom = (socket) => {
  if (socket.currentRoom && socket.currentUser) {
    rooms.get(socket.currentRoom)?.delete(socket.currentUser);
    socket.to(socket.currentRoom).emit("userJoined", Array.from(rooms.get(socket.currentRoom) || []));
    socket.leave(socket.currentRoom);

    // Clean up whiteboard state if no users left
    if (rooms.get(socket.currentRoom)?.size === 0) {
      whiteboardStates.delete(socket.currentRoom);
      rooms.delete(socket.currentRoom);
    }

    socket.currentRoom = null;
    socket.currentUser = null;
  }
};

export const handleCodeChange = (socket, { roomId, code }) => {
  socket.to(roomId).emit("codeUpdate", code);
};

export const handleTyping = (socket, { roomId, userName }) => {
  socket.to(roomId).emit("userTyping", userName);
};

export const handleLanguageChange = (socket, { roomId, language }) => {
  socket.to(roomId).emit("languageUpdate", language);
};
