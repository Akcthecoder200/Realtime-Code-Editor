import { io } from "socket.io-client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import LandingPage from "./components/LandingPage";
import Whiteboard from "./components/Whiteboard";

import RoomPage from "./components/RoomPage";
import { Roomcontext } from "./context/RoomContext";
import { useState } from "react";

const socket = io("https://realtime-code-editor-inag.onrender.com/");

const App = () => {
  const [roomId, setRoomId] = useState();
  
  return (
    <Roomcontext.Provider value={{ socket, roomId, setRoomId }}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/room/:roomId?" element={<RoomPage />} />
          <Route path="/roompage" element={<RoomPage />} />
        </Routes>
      </BrowserRouter>
    </Roomcontext.Provider>
  );
};

export default App;
