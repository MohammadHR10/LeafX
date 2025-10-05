// backend/server.js
const express = require('express');
require('dotenv').config();

const app = express();
app.use(express.json());

app.post('/api/gemini', async (req, res) => {
  console.log("Received request at /api/gemini");
  const { prompt } = req.body;
  try {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY is missing from environment");
    }
    const { GoogleGenerativeAI } = require('@google/generative-ai');
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    // Use the new model name from the docs:
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent(prompt);
    const aiText = result.response.text();
    res.json({ text: aiText });
  } catch (err) {
    console.error("Gemini backend error:", err);
    res.status(500).json({ error: "Gemini request failed." });
  }
});

app.listen(5001, () => console.log('Server running on port 5001'));

// // backend/server.js
// const express = require('express');
// const { GoogleGenerativeAI } = require('@google/generative-ai');
// require('dotenv').config();

// const app = express();
// app.use(express.json());

// app.post('/api/gemini', async (req, res) => {
//   const { prompt } = req.body;
//   const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
//   try {
//     const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" }, { apiVersion: "v1beta" });
//     const result = await model.generateContent(prompt);
//     const aiText = result.response.text();
//     res.json({ text: aiText });
//   } catch (err) {
//     res.status(500).json({ error: "Gemini request failed." });
//   }
// });

// app.listen(5001, () => console.log('Server running on port 5001'));


// // server.js (ESM)
// import cors from "cors";
// import express from "express";

// const app = express();
// const PORT = process.env.PORT || 5001; // use 5001 to avoid macOS system service on 5000

// app.use(cors()); // allow cross-origin requests
// app.use(express.json());

// app.get("/api/message", (req, res) => {
//   // return `text` to match frontend's `data.text` usage
//   res.json({ text: "LeafX backend is running!" });
// });

// app.listen(PORT, () => {
//   console.log(`Server running on http://localhost:${PORT}`);
// });

// process.on("uncaughtException", (err) => {
//   console.error("Uncaught exception:", err);
//   process.exit(1);
// });

// process.on("unhandledRejection", (reason) => {
//   console.error("Unhandled rejection:", reason);
//   process.exit(1);
// });
