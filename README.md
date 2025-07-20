# Real Time Code Editor & Collaborative Whiteboard

A full-stack web application for real-time collaborative code editing and drawing, featuring:

- **Live code editing** with Monaco Editor
- **Multi-language support** (JavaScript, Python, Java, C++)
- **Code execution** with output console
- **Room-based collaboration** (join by Room ID)
- **User presence** (see who is in the room, typing indicators)
- **Real-time collaborative whiteboard** powered by [tldraw](https://tldraw.dev/)
- **Persistent whiteboard state** per room

---

## Features

### 1. Real-Time Code Editor

- Edit code collaboratively in real time using Monaco Editor
- Language selection: JavaScript, Python, Java, C++
- See who is typing
- Code execution with output displayed in a console

### 2. Collaborative Whiteboard

- Draw, sketch, and annotate together using tldraw
- All changes are synchronized in real time
- New users joining a room receive the current whiteboard state

### 3. Room System & User Presence

- Create or join a room by Room ID
- See a list of users in the room
- Copy Room ID for sharing
- Leave room at any time

---

## Technologies Used

- **Frontend:** React, Vite, Tailwind CSS, Monaco Editor, tldraw
- **Backend:** Node.js, Express, Socket.IO
- **Code Execution:** [Piston API](https://github.com/engineer-man/piston)

---

## Getting Started

### Prerequisites

- Node.js (v16+ recommended)
- npm

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/realtime-code-editor.git
cd realtime-code-editor
```

### 2. Install Dependencies

#### Backend

```bash
cd backend
npm install
```

#### Frontend

```bash
cd ../frontend
npm install
```

### 3. Environment Variables

- By default, the backend runs on port 5000.
- The frontend expects the backend at `http://localhost:5000` (for local dev) or your deployed backend URL.
- To use a different backend URL, update the `io()` call in `frontend/src/App.jsx`.

### 4. Running Locally

#### Start Backend

```bash
cd backend
npm start
```

#### Start Frontend

```bash
cd frontend
npm run dev
```

- Visit `http://localhost:5173` (or the port Vite shows) in your browser.

### 5. Deployment

- The backend can be deployed to any Node.js-compatible host (e.g., Render, Heroku, Vercel serverless functions).
- The frontend can be built with `npm run build` and served as static files.
- Update the socket URL in `App.jsx` to your deployed backend.

---

## Usage

1. **Join a Room:** Enter a Room ID and your name to join or create a room.
2. **Collaborate:**
   - Edit code together in real time.
   - See who is in the room and who is typing.
   - Select language and run code; see output in the console.
   - Draw together on the whiteboard; all changes sync instantly.
3. **Share:** Copy the Room ID and share with others to collaborate.
4. **Leave Room:** Click 'Leave Room' to exit.

---

## Project Structure

```
Real time Code Editor/
  backend/           # Express + Socket.IO server
    index.js
  frontend/          # React app (Vite)
    src/
      App.jsx        # Main app logic
      ...
    public/
    ...
  README.md
  package.json
```

---

## Dependencies

- React, Vite, Tailwind CSS
- @monaco-editor/react
- @tldraw/tldraw
- socket.io, socket.io-client
- express, axios

---

## License

MIT

---

## Credits

- [Monaco Editor](https://microsoft.github.io/monaco-editor/)
- [tldraw](https://tldraw.dev/)
- [Piston API](https://github.com/engineer-man/piston)
