import { useEffect, useState, useMemo } from "react";
import io from "socket.io-client";
import Editor from "@monaco-editor/react";
import { Tldraw, createTLStore, defaultShapeUtils } from "@tldraw/tldraw";
import "tldraw/tldraw.css";

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
  const [outPut, setOutPut] = useState("");
  const [version] = useState("*");
  // const canvasRef = useRef(null);
  // const ctxRef = useRef(null);
  // const [drawing, setDrawing] = useState(false);

  const store = useMemo(
    () => createTLStore({ shapeUtils: defaultShapeUtils }),
    []
  );

  // Helper to get the full state from the store
  const getFullWhiteboardState = () => {
    // Use store.serialize() for full state
    return store.serialize ? store.serialize() : null;
  };

  useEffect(() => {
    // if (!canvasRef.current) return;
    // const canvas = canvasRef.current;
    // canvas.width = window.innerWidth;
    // canvas.height = window.innerHeight;

    // const ctx = canvas.getContext("2d");
    // ctx.lineCap = "round";
    // ctx.strokeStyle = "#000";
    // ctx.lineWidth = 2;
    // ctxRef.current = ctx;
    // socket.on("drawing", onDrawingEvent);

    // socket.on("clear-board", clearCanvas);

    //tldraw
    // Handler for remote changes
    const handleRemoteChanges = (remoteChanges) => {
      store.applyRemoteChanges(remoteChanges);
    };

    // Handler for receiving the full whiteboard state
    const handleWhiteboardState = ({ fullState }) => {
      if (fullState) {
        store.loadSnapshot(fullState);
      }
    };

    // Handler for when another client requests the full state
    const handleRequestWhiteboardState = () => {
      const fullState = getFullWhiteboardState();
      if (fullState) {
        socket.emit("whiteboard-state", { fullState, roomId });
      }
    };

    socket.on("whiteboard-update", handleRemoteChanges);
    socket.on("whiteboard-state", handleWhiteboardState);
    socket.on("request-whiteboard-state", handleRequestWhiteboardState);

    // Listen for local changes and emit them
    const cleanup = store.listen((localChanges, info = {}) => {
      const { source } = info;
      if (source === "loadSnapshot") {
        const fullState = getFullWhiteboardState();
        socket.emit("whiteboard-update", {
          roomId,
          changes: localChanges,
          fullState,
        });
      } else {
        socket.emit("whiteboard-update", { roomId, changes: localChanges });
      }
    });

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
    socket.on("codeResponse", (response) => {
      setOutPut(response.run.output);
    });

    return () => {
      socket.off("userJoined");
      socket.off("codeUpdate");
      socket.off("userTyping");
      socket.off("languageUpdate");
      socket.off("codeResponse");
      // socket.off("drawing");
      // socket.off("clear-board");
      cleanup();
      socket.off("whiteboard-update", handleRemoteChanges);
      socket.off("whiteboard-state", handleWhiteboardState);
      socket.off("request-whiteboard-state", handleRequestWhiteboardState);
    };
  }, [joined, store, roomId]);

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

  // const drawLine = (x0, y0, x1, y1, emit) => {
  //   const ctx = ctxRef.current;
  //   ctx.beginPath();
  //   ctx.moveTo(x0, y0);
  //   ctx.lineTo(x1, y1);
  //   ctx.stroke();
  //   ctx.closePath();

  //   if (!emit) return;

  //   socket.emit("drawing", {
  //     roomId,
  //     data: { x0, y0, x1, y1 },
  //   });
  // };

  // const onMouseDown = (e) => {
  //   setDrawing(true);
  //   const { offsetX, offsetY } = e.nativeEvent;
  //   ctxRef.current.beginPath();
  //   ctxRef.current.moveTo(offsetX, offsetY);
  //   ctxRef.current.stroke();
  //   lastPoint.current = { x: offsetX, y: offsetY };
  // };

  // const lastPoint = useRef({ x: 0, y: 0 });

  // const onMouseMove = (e) => {
  //   if (!drawing) return;
  //   const { offsetX, offsetY } = e.nativeEvent;
  //   drawLine(lastPoint.current.x, lastPoint.current.y, offsetX, offsetY, true);
  //   lastPoint.current = { x: offsetX, y: offsetY };
  // };

  // const onMouseUp = () => setDrawing(false);

  // const onDrawingEvent = ({ x0, y0, x1, y1 }) => {
  //   drawLine(x0, y0, x1, y1, false);
  // };
  // const clearCanvas = () => {
  //   const canvas = canvasRef.current;
  //   ctxRef.current.clearRect(0, 0, canvas.width, canvas.height);
  // };

  // const handleClear = () => {
  //   clearCanvas();
  //   socket.emit("clear-board", roomId);
  // };
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
  const runCode = () => {
    socket.emit("compileCode", { code, roomId, language, version });
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
      <div
        style={{ width: "20%" }}
        className="p-6 bg-gray-800 text-gray-100 flex flex-col"
      >
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
      <div style={{ width: "40%" }} className="bg-white">
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
          }}
        />
        <button
          className="run-btn bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded mt-4 transition-colors"
          onClick={runCode}
        >
          Execute
        </button>
        <textarea
          className="output-console w-full mt-2 p-2 text-lg h-52 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-400"
          value={outPut}
          readOnly
          placeholder="Output will appear here ..."
        />
      </div>
      {/* <div style={{ width: "40%", height: "100vh" }}> */}
      {/* <canvas
          ref={canvasRef}
          className="absolute top-0 left-0 w-full h-full bg-white"
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
        />
        <button
          className="absolute top-4 right-4 px-4 py-2 bg-red-500 text-white rounded-xl shadow-md"
          onClick={handleClear}
        >
          Clear
        </button> */}

      {/* <Tldraw store={store} /> */}
      {/* </div> */}
      {/* Tldraw Whiteboard Area */}
      <div className="w-[40%] h-screen relative flex flex-col">
        <div className="w-full h-full min-h-0">
          <Tldraw store={store} />
        </div>
      </div>
    </div>
  );
};

export default App;
