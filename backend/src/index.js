const express = require("express");
const cors = require("cors");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Mock task list (Snapshot 1 scope)
const tasks = [
  { id: "scouting", name: "Scouting" },
  { id: "sizing", name: "Sizing" },
  { id: "classification", name: "Classification" }
];

// In-memory storage (will become DB-backed in Snapshot 2)
const submissions = [];

// Health check
app.get("/health", (req, res) => {
  res.json({ ok: true });
});

// Get available tasks
app.get("/tasks", (req, res) => {
  res.json({ tasks });
});

// Submit task data
app.post("/submissions", (req, res) => {
  const { taskType, payload, userId } = req.body || {};

  if (!taskType || !payload) {
    return res.status(400).json({ error: "taskType and payload are required" });
  }

  const record = {
    id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    taskType,
    payload,
    userId: userId || "anonymous",
    createdAt: new Date().toISOString()
  };

  submissions.push(record);
  res.status(201).json({ submission: record });
});

// Get all submissions
app.get("/submissions", (req, res) => {
  res.json({ submissions });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});

