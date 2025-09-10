import express from "express";
import path from "path";

const router = express.Router();
const __dirname = path.resolve();

// Serve static files from React app
router.use(express.static(path.join(__dirname, "/frontend/dist")));

// API routes can go here if needed
// router.use('/api', apiRoutes);

// Handle specific React routes
router.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "/frontend/dist/index.html"));
});

router.get("/roompage", (req, res) => {
  res.sendFile(path.join(__dirname, "/frontend/dist/index.html"));
});

// Catch-all handler for any other routes (SPA fallback)
router.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "/frontend/dist/index.html"));
});

export default router;
