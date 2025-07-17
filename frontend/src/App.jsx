import { useEffect, useState } from "react";
import io from "socket.io-client";
import Editor from "@monaco-editor/react";

const socket = io("http://localhost:5000");

const App = () => {
  const [joined, setJoined] = useState(false);
  const [roomId, setRoomId] = useState("");
  const [userName, setUserName] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [code, setCode] = useState("// start code here");
  const [copySuccess, setCopySuccess] = useState("");
  const [users, setUsers] = useState([]);
  const [typing, setTyping] = useState("");

  useEffect(() => {
    socket.on("userJoined", (users) => {
      setUsers(users);
    });

    socket.on("codeUpdate", (newCode) => {
      setCode(newCode);
    });

    socket.on("userTyping", (user) => {
      setTyping(`${user.slice(0, 8)}... is Typing`);
      setTimeout(() => setTyping(""), 2000);
    });

    socket.on("languageUpdate", (newLanguage) => {
      setLanguage(newLanguage);
    });

    return () => {
      socket.off("userJoined");
      socket.off("codeUpdate");
      socket.off("userTyping");
      socket.off("languageUpdate");
    };
  }, []);

  useEffect(() => {
    const handleBeforeUnload = () => {
      socket.emit("leaveRoom");
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  const joinRoom = () => {
    if (roomId && userName) {
      socket.emit("join", { roomId, userName });
      setJoined(true);
    }
  };

  const leaveRoom = () => {
    socket.emit("leaveRoom");
    setJoined(false);
    setRoomId("");
    setUserName("");
    setCode("// start code here");
    setLanguage("javascript");
  };

  const copyRoomId = () => {
    navigator.clipboard.writeText(roomId);
    setCopySuccess("Copied!");
    setTimeout(() => setCopySuccess(""), 2000);
  };

  const handleCodeChange = (newCode) => {
    setCode(newCode);
    socket.emit("codeChange", { roomId, code: newCode });
    socket.emit("typing", { roomId, userName });
  };

  const handleLanguageChange = (e) => {
    const newLanguage = e.target.value;
    setLanguage(newLanguage);
    socket.emit("languageChange", { roomId, language: newLanguage });
  };

  if (!joined) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-indigo-400 to-purple-700">
        <div className="bg-white p-8 rounded-lg shadow-lg text-center w-80">
          <h1 className="mb-6 text-2xl font-bold text-gray-800">
            Join Code Room
          </h1>
          <input
            type="text"
            placeholder="Room Id"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            className="w-full p-3 mb-4 border border-gray-300 rounded text-base focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
          <input
            type="text"
            placeholder="Your Name"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            className="w-full p-3 mb-4 border border-gray-300 rounded text-base focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
          <button
            onClick={joinRoom}
            className="w-full p-3 bg-blue-500 text-white rounded font-semibold hover:bg-blue-700 transition-colors"
          >
            Join Room
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen">
      <div className="w-64 p-6 bg-gray-800 text-gray-100 flex flex-col">
        <div className="flex flex-col items-center mb-4">
          <h2 className="mb-2 text-lg font-semibold">Code Room: {roomId}</h2>
          <button
            onClick={copyRoomId}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-800 transition-colors"
          >
            Copy Id
          </button>
          {copySuccess && (
            <span className="ml-2 text-green-400 text-sm">{copySuccess}</span>
          )}
        </div>
        <h3 className="mt-6 mb-2 text-base font-medium">Users in Room:</h3>
        <ul className="list-none">
          {users.map((user, index) => (
            <li key={index} className="p-2 text-sm bg-gray-600 mt-1 rounded">
              {user.slice(0, 8)}...
            </li>
          ))}
        </ul>
        <p className="mt-4 text-white text-base min-h-[24px]">{typing}</p>
        <select
          className="mt-4 w-full p-2 bg-gray-700 text-white rounded"
          value={language}
          onChange={handleLanguageChange}
        >
          <option value="javascript">JavaScript</option>
          <option value="python">Python</option>
          <option value="java">Java</option>
          <option value="cpp">C++</option>
        </select>
        <button
          className="mt-4 w-full p-3 bg-red-500 text-white rounded font-semibold hover:bg-red-700 transition-colors"
          onClick={leaveRoom}
        >
          Leave Room
        </button>
      </div>
      <div className="flex-grow bg-white">
        <Editor
          height={"100%"}
          defaultLanguage={language}
          language={language}
          value={code}
          onChange={handleCodeChange}
          theme="vs-dark"
          options={{
            minimap: { enabled: false },
            fontSize: 14,
          }}
        />
      </div>
    </div>
  );
};

export default App;
