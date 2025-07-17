# Real Time Code Editor

A modern, collaborative real-time code editor built with React, Monaco Editor, Socket.IO, and Express. Instantly share code, collaborate, and see changes live with multiple users in a shared room.

---

## 🚀 Features

- **Real-time collaborative code editing**
- **Multiple language support** (JavaScript, Python, Java, C++)
- **Room-based sessions**: Join or create a room with a unique ID
- **Live user presence**: See who is in the room
- **Typing indicators**: Know when someone is typing
- **Copy room ID** for easy sharing
- **Leave and rejoin rooms**
- **Modern, responsive UI** powered by Tailwind CSS

---

## 🛠️ Tech Stack

- **Frontend:** React, Vite, Monaco Editor, Tailwind CSS, Socket.IO Client
- **Backend:** Node.js, Express, Socket.IO

---

## 📦 Installation & Setup

### 1. Clone the repository

```bash
git clone <repo-url>
cd Real time Code Editor
```

### 2. Install dependencies

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

### 3. Start the servers

#### Start backend server

```bash
cd ../backend
npm start
```

#### Start frontend dev server

```bash
cd ../frontend
npm run dev
```

- The frontend will run on [http://localhost:5173](http://localhost:5173)
- The backend (Socket.IO server) will run on [http://localhost:5000](http://localhost:5000)

---

## 💡 Usage

1. Open the frontend in your browser.
2. Enter a room ID and your name to join or create a room.
3. Share the room ID with others to collaborate in real time.
4. Select your preferred language and start coding together!

---

## 🤝 Contributing

Contributions are welcome! To contribute:

1. Fork the repository
2. Create a new branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -m 'Add some feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

## 🙏 Acknowledgements

- [Monaco Editor](https://microsoft.github.io/monaco-editor/)
- [Socket.IO](https://socket.io/)
- [Tailwind CSS](https://tailwindcss.com/)
- [React](https://react.dev/)
