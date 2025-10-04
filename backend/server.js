// server.js (ESM)
import cors from "cors";
import express from "express";

const app = express();
const PORT = process.env.PORT || 5001; // use 5001 to avoid macOS system service on 5000

app.use(cors()); // allow cross-origin requests
app.use(express.json());

app.get("/api/message", (req, res) => {
  // return `text` to match frontend's `data.text` usage
  res.json({ text: "LeafX backend is running!" });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

process.on("uncaughtException", (err) => {
  console.error("Uncaught exception:", err);
  process.exit(1);
});

process.on("unhandledRejection", (reason) => {
  console.error("Unhandled rejection:", reason);
  process.exit(1);
});
