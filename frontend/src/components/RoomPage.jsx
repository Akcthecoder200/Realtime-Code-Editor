
import { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { FaUsers, FaCopy, FaSignOutAlt, FaChalkboardTeacher, FaCode, FaUserPlus, FaRandom } from "react-icons/fa";
import Editor from "@monaco-editor/react";
import Whiteboard from "./Whiteboard";
import { Roomcontext } from "../context/RoomContext";

const RoomPage = () => {
  const { socket, roomId, setRoomId } = useContext(Roomcontext);
  const { roomId: urlRoomId } = useParams();
  const navigate = useNavigate();
  
  const [joined, setJoined] = useState(false);
  const [userName, setUserName] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [code, setCode] = useState("// start code here");
  const [copySuccess, setCopySuccess] = useState("");
  const [users, setUsers] = useState([]);
  const [typing, setTyping] = useState("");
  const [outPut, setOutPut] = useState("");
  const [isExecuting, setIsExecuting] = useState(false);
  const [version] = useState("*");
  const [connectionStatus, setConnectionStatus] = useState("connected");

  // Check for persisted session on component mount
  useEffect(() => {
    const savedSession = localStorage.getItem('codeEditorSession');
    const currentRoomId = urlRoomId || roomId;
    
    if (savedSession && currentRoomId) {
      const session = JSON.parse(savedSession);
      if (session.roomId === currentRoomId && session.userName) {
        setRoomId(currentRoomId);
        setUserName(session.userName);
        setJoined(true);
        // Auto-rejoin the room
        socket.emit("join", { roomId: currentRoomId, userName: session.userName });
      }
    } else if (currentRoomId && !roomId) {
      setRoomId(currentRoomId);
    }
  }, [urlRoomId, roomId, setRoomId, socket]);

  useEffect(() => {
    // Socket connection status monitoring
    socket.on("connect", () => {
      setConnectionStatus("connected");
      console.log("✅ Connected to server");
    });

    socket.on("disconnect", () => {
      setConnectionStatus("disconnected");
      console.log("❌ Disconnected from server");
    });

    socket.on("reconnect", () => {
      setConnectionStatus("connected");
      console.log("🔄 Reconnected to server");
      // Re-join room if we were in one
      if (joined && roomId && userName) {
        socket.emit("join", { roomId, userName });
      }
    });

    socket.on("connect_error", (error) => {
      setConnectionStatus("error");
      console.error("Connection error:", error);
    });

    socket.on("userJoined", (users) => {
      setUsers(users);
    });

    socket.on("codeUpdate", (newCode) => {
      setCode(newCode);
    });

    socket.on("userTyping", (user) => {
      setTyping(`${user} is typing...`);
      setTimeout(() => setTyping(""), 2000);
    });

    socket.on("languageUpdate", (newLanguage) => {
      setLanguage(newLanguage);
    });
    
    socket.on("codeResponse", (response) => {
      setOutPut(response.run.output);
      setIsExecuting(false);
    });

    socket.on("error", (error) => {
      console.error("Socket error:", error);
      alert(error.message || "An error occurred");
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("reconnect");
      socket.off("connect_error");
      socket.off("userJoined");
      socket.off("codeUpdate");
      socket.off("userTyping");
      socket.off("languageUpdate");
      socket.off("codeResponse");
      socket.off("error");
    };
  }, [socket, joined, roomId, userName]);

  useEffect(() => {
    const handleBeforeUnload = () => {
      socket.emit("leaveRoom");
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [socket]);

  const joinRoom = () => {
    if (roomId && userName) {
      socket.emit("join", { roomId, userName });
      setJoined(true);
      
      // Save session to localStorage
      localStorage.setItem('codeEditorSession', JSON.stringify({
        roomId,
        userName,
        timestamp: Date.now()
      }));
      
      // Update URL to include room ID
      navigate(`/room/${roomId}`, { replace: true });
    } else {
      alert("Enter Name and Room ID.");
    }
  };

  const leaveRoom = () => {
    socket.emit("leaveRoom");
    setJoined(false);
    setRoomId("");
    setUserName("");
    setCode("// start code here");
    setLanguage("javascript");
    
    // Clear session from localStorage
    localStorage.removeItem('codeEditorSession');
    
    // Navigate back to landing page
    navigate("/", { replace: true });
  };

  const copyRoomId = () => {
    navigator.clipboard.writeText(roomId);
    setCopySuccess("Copied!");
    setTimeout(() => setCopySuccess(""), 2000);
  };

  const handleCodeChange = (newCode) => {
    setCode(newCode);
    
    // Emit code change immediately for real-time collaboration
    socket.emit("codeChange", { roomId, code: newCode });
    
    // Debounce typing indicator to reduce spam
    clearTimeout(window.typingTimeout);
    window.typingTimeout = setTimeout(() => {
      socket.emit("typing", { roomId, userName });
    }, 150);
  };

  const handleLanguageChange = (e) => {
    const newLanguage = e.target.value;
    setLanguage(newLanguage);
    socket.emit("languageChange", { roomId, language: newLanguage });
  };
  
  const runCode = () => {
    setIsExecuting(true);
    socket.emit("compileCode", { code, roomId, language, version });
  };

  if (!joined) {
    const handleBack = () => {
      // Navigate to landing page (index.html or root)
      navigate("/");
    };
    
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-400">
        <div className="bg-white/90 p-10 rounded-2xl shadow-2xl text-center w-96 border border-purple-200 relative">
          <button
            onClick={handleBack}
            className="absolute left-4 top-4 flex items-center gap-1 text-purple-500 hover:text-purple-700 font-semibold text-base px-3 py-1 bg-purple-100 rounded-full shadow-sm transition-colors"
            title="Back"
          >
            <svg xmlns='http://www.w3.org/2000/svg' className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            Back
          </button>
          <div className="flex items-center justify-center gap-3 mb-6 mt-2">
            <FaChalkboardTeacher className="text-3xl text-purple-600 animate-pulse" />
            <h1 className="text-3xl font-extrabold text-gray-800 tracking-wide drop-shadow-lg">Join Code Room</h1>
          </div>
          <form onSubmit={(e) => e.preventDefault()} className="flex flex-col gap-4">
            <div className="relative flex items-center">
              <input
                type="text"
                placeholder="Room Id"
                value={roomId || ""}
                onChange={(e) => setRoomId(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded text-base focus:outline-none focus:ring-2 focus:ring-purple-400 pr-12"
              />
              <button
                type="button"
                onClick={() => setRoomId(uuidv4())}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-purple-500 hover:text-purple-700"
                title="Generate Random Room ID"
              >
                <FaRandom className="text-xl" />
              </button>
            </div>
            <div className="relative flex items-center">
              <input
                type="text"
                placeholder="Your Name"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded text-base focus:outline-none focus:ring-2 focus:ring-purple-400 pr-12"
              />
              <FaUserPlus className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-400 text-lg" />
            </div>
            <button
              type="submit"
              onClick={joinRoom}
              className="w-full p-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded font-bold shadow-md hover:from-purple-600 hover:to-blue-600 transition-colors flex items-center justify-center gap-2"
            >
              <FaUsers className="text-lg" /> Join Room
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100">
      {/* Sidebar */}
      <div
        style={{ width: "20%" }}
        className="p-6 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-700 text-gray-100 flex flex-col shadow-2xl border-r border-purple-200 z-10"
      >
        <div className="flex flex-col items-center mb-6">
          <div className="flex items-center gap-2 mb-2">
            <FaCode className="text-xl text-green-400" />
            <h2
              className="text-lg font-bold max-w-full truncate tracking-wide"
              title={roomId}
            >
              Room ID
            </h2>
            <button
              onClick={copyRoomId}
              className="ml-2 px-2 py-1 bg-blue-600 hover:bg-blue-800 text-white rounded transition-colors flex items-center gap-1 text-xs"
              title="Copy Room ID"
            >
              <FaCopy />
              Copy
            </button>
          </div>
          <span className="text-xs bg-white/10 px-3 py-1 rounded-full font-mono tracking-wider border border-white/20 text-purple-200">
            {roomId}
          </span>
          <div className={`flex items-center gap-2 mt-2 text-xs ${
            connectionStatus === "connected" ? "text-green-400" : 
            connectionStatus === "disconnected" ? "text-red-400" : "text-yellow-400"
          }`}>
            <div className={`w-2 h-2 rounded-full ${
              connectionStatus === "connected" ? "bg-green-400 animate-pulse" : 
              connectionStatus === "disconnected" ? "bg-red-400" : "bg-yellow-400"
            }`}></div>
            {connectionStatus === "connected" ? "Connected" : 
             connectionStatus === "disconnected" ? "Disconnected" : "Connecting..."}
          </div>
          {copySuccess && (
            <span className="mt-2 text-green-400 text-sm animate-pulse">{copySuccess}</span>
          )}
        </div>
        <h3 className="mt-4 mb-2 text-base font-semibold flex items-center gap-2">
          <FaUsers className="text-lg text-blue-300" /> Users in Room
        </h3>
        <ul className="list-none max-h-32 overflow-y-auto scrollbar-thin scrollbar-thumb-purple-400 scrollbar-track-gray-700">
          {users.map((user, index) => (
            <li
              key={index}
              className="p-2 text-sm bg-gray-600 mt-1 rounded max-w-full truncate flex items-center gap-2"
            >
              <span className="inline-block w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              {user}
            </li>
          ))}
        </ul>
        <p className="mt-4 text-white text-base min-h-[24px] max-w-40 truncate italic">
          {typing}
        </p>
        <label className="mt-4 text-sm font-medium text-purple-200">Language</label>
        <select
          className="mt-1 w-full p-2 bg-gray-700 text-white rounded border border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-400"
          value={language}
          onChange={handleLanguageChange}
        >
          <option value="javascript">JavaScript</option>
          <option value="python">Python</option>
          <option value="java">Java</option>
          <option value="cpp">C++</option>
        </select>
        <button
          className="mt-6 w-full p-3 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded font-semibold hover:from-red-600 hover:to-pink-600 transition-colors flex items-center justify-center gap-2"
          onClick={leaveRoom}
        >
          <FaSignOutAlt className="text-lg" /> Leave Room
        </button>
      </div>
      {/* Code Editor */}
      <div style={{ width: "40%" }} className="bg-white/90 flex flex-col border-r border-purple-200 shadow-lg">
        <div className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-md z-10">
          <FaCode className="text-2xl animate-pulse" />
          <h2 className="text-xl font-bold tracking-wide drop-shadow-lg">Collaborative Code Editor</h2>
        </div>
        <div className="flex-1 flex flex-col p-4">
          <Editor
            height={"60%"}
            defaultLanguage={language}
            language={language}
            value={code}
            onChange={handleCodeChange}
            theme="vs-dark"
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              lineNumbers: "on",
              roundedSelection: false,
              scrollBeyondLastLine: false,
              automaticLayout: true,
              tabSize: 2,
              insertSpaces: true,
              wordWrap: "on",
              formatOnType: true,
              formatOnPaste: true,
              quickSuggestions: true,
              suggestOnTriggerCharacters: true,
              acceptSuggestionOnEnter: "on",
              bracketPairColorization: { enabled: true },
              guides: {
                bracketPairs: true,
                indentation: true,
              },
            }}
          />
          <button
            className="ml-2 run-btn bg-gradient-to-r from-green-500 to-lime-500 hover:from-green-600 hover:to-lime-600 text-white font-semibold py-2 px-4 rounded mt-4 transition-colors flex items-center gap-2 w-fit shadow-lg"
            onClick={runCode}
            disabled={isExecuting}
          >
            <FaCode className="text-lg" /> {isExecuting ? "Executing..." : "Run"}
          </button>
          <textarea
            className="output-console w-full mt-4 p-2 text-lg h-40 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-400 bg-gray-50 shadow-inner"
            value={outPut}
            readOnly
            placeholder="Output will appear here ..."
          />
        </div>
      </div>
      {/* Whiteboard */}
      <div className="w-[40%] h-screen relative flex flex-col">
        <Whiteboard socket={socket} roomId={roomId} />
      </div>
    </div>
  );
};

export default RoomPage;
